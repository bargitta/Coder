$(function(){
var w = 800;
var h = 600;
var padding = 70;
var dataset=[];
var width = w;
var height = h;
var color_hash = {
    0 : ["line1", "green"],
    1 : ["line2", "orange"],
    2 : ["line3", "red"],
    3 : ["line4", "black"],
    4 : ["line5", "blue"]
};
d3.json("data/d3data.json", function (error, data) {
    data.forEach(function (d) {
        var lineData = getRealData(d);
        dataset.push(lineData);
    });
    function getRealData(d) {
        var point = d[0];
        var line = [];
        line.push(point);
        for (var i = 1; i < 5; i++) {
            line.push({"sppa": point.sppa + 30 * i, "bitDepth": point.bitDepth + 100 * i});
        }
        return line;
    }

    // Define axis ranges & scales
    var yExtents = d3.extent(d3.merge(dataset), function (d) { return d.bitDepth; });
    var xExtents = d3.extent(d3.merge(dataset), function (d) { return d.sppa; });

    var xScale = d3.scale.linear()
        .domain([xExtents[0], xExtents[1]])
        .range([padding, w - padding]);

    var yScale = d3.scale.linear()
        .domain([0, yExtents[1]])
        .range([h - padding, padding]);


    // Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", padding)
        .attr("y", padding)
        .attr("width", width-padding*2)
        .attr("height", height-padding*2);

    var zoom = d3.behavior.zoom().scaleExtent([0.2, 5]).x(xScale)
        .y(yScale).on("zoom", redraw);
    var chartBody = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .call(zoom);
    var rect = chartBody.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    // Define lines
    var line = d3.svg.line()
        .x(function(d) { return x(d.sppa); })
        .y(function(d) { return y(d.bitDepth); });

    var pathContainers = chartBody.selectAll('g.line')
        .data(dataset)
        .enter()
        .append('g')
        .attr('class', 'line')
        .attr("style", function(d) {
            return "stroke: " + color_hash[dataset.indexOf(d)][1];
        });

    var paths= pathContainers.selectAll('path')
        .data(function (d) { return [d]; }) // continues the data from the pathContainer
        .enter().append('path')
        .attr('d', d3.svg.line()
            .x(function (d) { return xScale(d.sppa); })
            .y(function (d) { return yScale(d.bitDepth); })
        );

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .outerTickSize(0)
        .ticks(5);
    var xAxis2 = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .outerTickSize(0)
        .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .outerTickSize(0)
        .ticks(5);

    //Define Y axis
    var yAxis2 = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .outerTickSize(0)
        .ticks(5);

    //Add X axis
    svg.append("g")
        .attr("class", "x axis axis1")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .call(xAxis.tickSize(-(h-2*padding ), 0,0));

    svg.append("g")
        .attr("class", "x axis axis2 no-tick")
        .attr("transform", "translate(0," + padding + ")")
        .call(xAxis2);

    //Add Y axis
    svg.append("g")
        .attr("class", "y axis axis3")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        .call(yAxis.tickSize(-(w-2*padding), 0, 0));

    svg.append("g")
        .attr("class", "y axis axis4 no-tick")
        .attr("transform", "translate(" + (w - padding) + ",0)")
        .call(yAxis2);


    // add legend
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(' + padding + ',50)');

    var legendPadding = 40,
        legendStep = (w - 2 * padding) / 5;

    legend.selectAll('legend-line')
        .data(dataset)
        .enter()
        .append("line")
        .attr('class', 'legend-line')
        .attr("x1", function(d,i){return i*legendStep;})
        .attr("y1", function(){ return h-55;})
        .attr("x2", function(d,i){return legendPadding + i*legendStep;})
        .attr("y2", function(){ return h-55;})
        .attr("style", function(d) {
            return "stroke: " + color_hash[dataset.indexOf(d)][1];
        });

    function redraw()
    {
        console.log(d3.event.translate, d3.event.scale);
        svg.select(".axis1").call(xAxis);
        svg.select(".axis2").call(xAxis2);
        svg.select(".axis3").call(yAxis);
        svg.select(".axis4").call(yAxis2);
        paths.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");

    }
    legend.selectAll('text')
        .data(dataset)
        .enter()
        .append("text")
        .attr('class', 'legend-text')
        .attr("x", function(d,i){return legendPadding + i*legendStep + 10;})
        .attr("y", function(){ return h-50;})
        .text(function(d) {
            var text = color_hash[dataset.indexOf(d)][0];
            return text;
        });

    addLables(svg, w-2*padding, h-2*padding, padding,'x axis label','y axis label');
});

function addLables(svg, contentWidth, contentHeight, padding, yLabel, xLabel) {
    svg.append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'translate(' + padding * 0.2 + ',' + contentHeight *0.6 + ')rotate(270)')
        .attr('text-anchor', 'middle')
        .text(yLabel);
    svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', contentWidth * 0.6)
        .attr('y', padding * 0.4)
        .attr('text-anchor', 'middle')
        .text(xLabel);
}});