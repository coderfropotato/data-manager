let d3 = require('d3');
let venn = require('venn');
let func = {
    heatmap(data, config, wrap) {
        var cluster_left = data.leftTree || null;
        var cluster_top = data.topTree || null;
        var heatmap_json = data.list;
        var valuemax = data.Max;
        var valuemin = data.Min;
        //apply config
        var projectName = config.projectName || "cluster"
        var colors = config.colors;
        var fontSize = config.fontSize || 12;
        var colorArr = config.colors;
        let temp = config.cubeSize.split('*');
        var cubeSize;
        // if (config.cubeSize.length && config.cubeSize.indexOf('*') !== -1 && temp.length == 2 && Number(temp[0]) !== 0 && Number(temp[1]) !== 0) {
        //     cubeSize = config.cubeSize.split('*')
        // } else {
        cubeSize = false;
        // }
        var drawBorder = config.drawBorder;
        var showRowName = !!config.showRowName;
        var oWidth = document.querySelector('.draw-area').offsetWidth - 80;
        var oHeight = document.querySelector('.draw-area').offsetHeight - 80;
        var width = oWidth * 0.95;
        var height = oHeight * 0.9;
        var height_add = 50;
        var svg = d3
            .select(wrap)
            .attr("width", width)
            .attr("height", height + height_add);

        svg.selectAll("g").remove();

        draw_chart_title();
        draw_cluster_pic(cluster_left, 'left');
        draw_cluster_pic(cluster_top, 'top');
        draw_heatmap(heatmap_json, valuemax, valuemin);
        function draw_chart_title() {
            svg
                .append("g")
                .attr("transform", "translate(" + (width * 0.1 + 8 + width * 0.6 / 2) + ",20)")
                .append("text")
                .text(projectName)
                .attr("text-anchor", "middle")
                .style('font-size', '16px');
        }
        function draw_cluster_pic(json, pos) {
            if (json) {
                var cluster_height, cluster_width;
                if (pos === 'left') {
                    cluster_height = (height*0.85 - 90);
                    cluster_width = width * 0.1;
                } else {
                    cluster_height = width * 0.6;
                    cluster_width = 50;
                }
                var cluster = d3
                    .cluster()
                    .size([cluster_height, cluster_width])
                    .separation(function () {
                        return 1;
                    });
                if (pos === 'left') {
                    // left
                    var svg_cluster_g = svg
                        .append("g")
                        .attr("class", pos + "-cluster")
                        .attr("transform", "translate(0,96)");
                } else {
                    // top
                    var svg_cluster_g = svg
                        .append("g")
                        .attr("class", pos + "-cluster")
                        .attr("transform", "translate(" + (width * 0.1 + 8 + width * 0.6 / 2 + cluster_height / 2) + ",40) rotate(90)")
                }
                var root = d3.hierarchy(json);
                cluster(root);
                var link = svg_cluster_g
                    .selectAll(".heatmaplink")
                    .data(root.links())
                    .enter()
                    .append("path")
                    .attr("class", "heatmaplink")
                    .attr("d", elbow);

                var node = svg_cluster_g
                    .selectAll(".node")
                    .data(root.descendants())
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                function elbow(d, i) {
                    return (
                        "M" +
                        d.source.y +
                        "," +
                        d.source.x +
                        "V" +
                        d.target.x +
                        "H" +
                        d.target.y
                    );
                }
            }
        }
        function draw_heatmap(jsonarray, max, min) {
            var colorarray = colors.concat();
            var heatmap_width, heatmap_height, heatmap_one_rect_width, heatmap_one_rect_height;
            if (cubeSize) {
                heatmap_one_rect_width = cubeSize[0];
                heatmap_one_rect_height = cubeSize[1];
                heatmap_width = heatmap_one_rect_width * jsonarray.length;
                heatmap_height = heatmap_one_rect_height * jsonarray[0].list.length;
            } else {
                heatmap_width = width * 0.60;
                heatmap_height = height*0.85 - 40 - 50;
                heatmap_one_rect_width = heatmap_width / jsonarray[0].list.length;
                heatmap_one_rect_height = heatmap_height / jsonarray.length;
            }

            var svg_heatmap_g = svg
                .append("g")
                .attr("class", "heatmap")
                .attr("transform", "translate(" + (width * 0.1 + 8) + ",96)");

            var heatmap_legend_width = 18;
            var heatmap_legend_height = 200;
            var svg_heatmap_legend_g = svg
                .append("g")
                .attr("class", "heatmaplegend")
                /* width - 40   (heatmap_width + width * 0.1 + 40) */
                .attr("transform", "translate(" + (width - 50) + "," + (height / 2) + ")");

            var colorscale = d3
                .scaleLinear()
                .domain([min, (min + max) / 2, max])
                .range(colorarray)
                .interpolate(d3.interpolateRgb);


            for (var i = 0; i < jsonarray.length; i++) {
                var svg_g_temp = svg_heatmap_g
                    .append("g")
                    .attr("class", jsonarray[i].sampleName);

                var isDrawBorderStatus = drawBorder ? '#ccc' : 'none';
                for (var j = 0; j < jsonarray[i].list.length; j++) {
                    svg_g_temp
                        .append("rect")
                        .attr("class", "heatmap_rect")
                        .attr("x", 0 + j * heatmap_one_rect_width)
                        .attr("y", 0 + i * heatmap_one_rect_height)
                        .attr("width", heatmap_one_rect_width)
                        .attr("height", heatmap_one_rect_height)
                        .attr("fill", colorscale(jsonarray[i].list[j].value))
                        .style('stroke', isDrawBorderStatus)
                        .append("title")
                        .text(
                        "name: " +
                        jsonarray[i].list[j].name +
                        "\n" +
                        "value: " +
                        jsonarray[i].list[j].value
                        );
                }
            }
            //row name
            if (showRowName) {
                var svg_sampleName = svg
                    .append("g")
                    .attr("class", "samplename")
                    .attr("transform", "translate(" + (width * 0.1 + 8 + width * 0.60 + 8) + ",98)");
                for (var i = 0; i < jsonarray.length; i++) {
                    svg_sampleName.append('text')
                        .attr('x', 0)
                        .attr('y', i * heatmap_one_rect_height + heatmap_one_rect_height / 2)
                        .style('font-size', fontSize + 'px')
                        .style('dominant-baseline', 'middle')
                        .text(jsonarray[i].sampleName)
                }
            }
            // column name
            var svg_column = svg
            .append("g")
            .attr("class", "samplename")
            .attr("transform", "translate(" +  (width * 0.1 + 8) + ","+(heatmap_height+96+8)+")");

            for(var k=0;k<jsonarray[0].list.length;k++){
                svg_column.append('g')
                    .attr('transform',"translate("+(k*heatmap_one_rect_width+heatmap_one_rect_width/2)+", 0)")    
                    .append('text')
                    .attr("transform","rotate(90)")
                    .style('text-anchor','left')
                    .style('font-size',fontSize+'px')
                    .style('dominant-baseline','middle')
                    .text(jsonarray[0].list[k].name)
            }

            // var svg_column = svg
            //     .append("g")
            //     .attr(
            //     "transform",
            //     "translate(" +
            //     (i) * heatmap_one_rect_width +
            //     "," +
            //     (heatmap_height) +
            //     ")"
            //     )
            //     .append("text")
            //     .style('font-size', fontSize + 'px')
            //     .text(jsonarray[i].sampleName)
            //     .attr("transform", "rotate(90)")
            //     .attr("text-anchor", "middle");
            // legend
            var linearGradient = svg_heatmap_legend_g
                .append("defs")
                .append("linearGradient")
                .attr("id", "linearColor")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            var stop1 = linearGradient
                .append("stop")
                .attr("offset", "0%")
                .style("stop-color", colorarray[2]);

            var stop2 = linearGradient
                .append("stop")
                .attr("offset", "50%")
                .style("stop-color", colorarray[1]);

            var stop3 = linearGradient
                .append("stop")
                .attr("offset", "100%")
                .style("stop-color", colorarray[0]);

            svg_heatmap_legend_g
                .append("rect")
                .attr("width", heatmap_legend_width)
                .attr("height", heatmap_legend_height)
                .attr("fill", "url(#" + linearGradient.attr("id") + ")");
            var yScale = d3
                .scaleLinear()
                .range([heatmap_legend_height - 1, 0])
                .clamp(true)
                .domain([min, max]);
            var yAxis = d3
                .axisRight(yScale)
                .tickSizeOuter(0)
                .ticks(5);
            svg_heatmap_legend_g
                .append("g")
                .attr("class", "heatmapaxis")
                .attr("transform", "translate(" + heatmap_legend_width + ",0)")
                .call(yAxis);
        }

    },
    venn(data, wrap) {
        let sets = [{ sets: ['A'], size: 12 },
        { sets: ['B'], size: 12 },
        { sets: ['A', 'B'], size: 2 }];

        var chart = venn.VennDiagram();
        d3.select(wrap).datum(sets).call(chart);
    }
}
function Tools() {
    this.type = '';
    this.wrap = '';
    this.drawFunc = func;
}
Tools.prototype.config = function (options) {
    this.type = options.type || '';
    this.wrap = typeof options['wrap'] === 'string' ? document.querySelector(options['wrap']) : options['wrap'];
}
Tools.prototype.setType = function (type) {
    this.type = type;
}
Tools.prototype.setWrap = function (wrap) {
    this.wrap = typeof wrap === 'string' ? document.querySelector(wrap) : wrap;
}
Tools.prototype.getOptions = function () {
    let type = this.type;
    let wrap = this.wrap;
    return { type, wrap };
}
Tools.prototype.getCurrentType = function () {
    return this.type;
}
Tools.prototype.draw = function (data, newConfig) {
    this.drawFunc[this.type](data, newConfig, this.wrap);
}

module.exports = new Tools();
