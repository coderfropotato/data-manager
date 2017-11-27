let d3 = require('d3');
var func = {
    heatmap(data, config, wrap) {
        var cluster_json = data.zxtData;
        var heatmap_json = data.heatmap;
        var valuemax = data.Max;
        var valuemin = data.Min;
        //apply config
        var projectName = config.projectName || "cluster"
        var colors = config.colors;
        var fontSize = config.fontSize || 12;
        var colorArr = config.colors;
        let temp = config.cubeSize.split('*');
        var cubeSize;
        if (config.cubeSize.length && config.cubeSize.indexOf('*') !== -1 && temp.length == 2 && Number(temp[0]) !== 0 && Number(temp[1]) !== 0) {
            cubeSize = config.cubeSize.split('*')
        } else {
            cubeSize = false;
        }
        var drawBorder = config.drawBorder;
        var showRowName = !!config.showRowName;
        //判断svg width
        var oWidth = document.querySelector('.draw-area').offsetWidth - 80;
        var oHeight = document.querySelector('.draw-area').offsetHeight - 80;
        var width = oWidth * 0.85;
        var height = oHeight * 0.9;
        //文字超长添加的高度
        var height_add = 50;
        var svg = d3
            .select(wrap)
            .attr("width", width)
            .attr("height", height + height_add);

        svg.selectAll("g").remove();

        draw_chart_title();
        draw_cluster_pic(cluster_json, 'left');
        draw_cluster_pic(cluster_json, 'top');
         draw_heatmap(heatmap_json, valuemax, valuemin);
        //画标题
        function draw_chart_title() {
            svg
                .append("g")
                .attr("transform", "translate(" + (width * 0.1 + 8 + width * 0.6 / 2) + ",20)")
                .append("text")
                .text(projectName)
                .attr("text-anchor", "middle")
                .style('font-size', fontSize + 'px');
        }
        //画聚类折线图
        function draw_cluster_pic(json, pos) {
            var cluster_height, cluster_width;
            if (pos === 'left') {
                cluster_height = height - 40 - height * 0.1;
                cluster_width = width * 0.1;
            } else {
                cluster_height =width * 0.6-40;
                cluster_width =50;
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
                    .attr("transform", "translate(" + (width * 0.1 + 8  + width*0.6 / 2+cluster_height/2) + ",40) rotate(90)")
            }
            //根据数据建立模型
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
        function draw_heatmap(jsonarray, max, min) {
            //定义渐变颜色
            var colorarray = colors.concat();
            var heatmap_width, heatmap_height, heatmap_one_rect_width, heatmap_one_rect_height;
            if (cubeSize) {
                heatmap_one_rect_width = cubeSize[0];
                heatmap_one_rect_height = cubeSize[1];
                heatmap_width = heatmap_one_rect_width * jsonarray.length;
                heatmap_height = heatmap_one_rect_height * jsonarray[0].geneList.length;
            } else {
                //定义热图宽度
                heatmap_width = width * 0.60;
                //定义热图高度
                heatmap_height = height - 40 - 50;
                //计算单个rect长和宽
                heatmap_one_rect_width = heatmap_width / jsonarray.length;
                heatmap_one_rect_height = heatmap_height / jsonarray[0].geneList.length;
            }

            //距离左边; top 预留50给title
            var svg_heatmap_g = svg
                .append("g")
                .attr("class", "heatmap")
                .attr("transform", "translate(" + (width * 0.1 + 8) + ",96)");

            //定义热图图例宽度
            var heatmap_legend_width = 18;
            //定义热图图例高度
            var heatmap_legend_height = 200;
            var svg_heatmap_legend_g = svg
                .append("g")
                .attr("class", "heatmaplegend")
                .attr("transform", "translate(" + (heatmap_width + width * 0.1 + 40) + "," + (height / 2) + ")");

            //颜色比例尺(根据value值填充rect的颜色)
            var colorscale = d3
                .scaleLinear()
                .domain([min, (min + max) / 2, max])
                .range(colorarray)
                .interpolate(d3.interpolateRgb);


            for (var i = 0; i < jsonarray.length; i++) {
                var svg_g_temp = svg_heatmap_g
                    .append("g")
                    .attr("class", jsonarray[i].sampleName);
                //添加样本名称
                if (showRowName) {
                    svg_g_temp
                        .append("g")
                        .attr(
                        "transform",
                        "translate(" +
                        (i + 0.5) * heatmap_one_rect_width +
                        "," +
                        (heatmap_height + 20) +
                        ")"
                        )
                        .append("text")
                        .style('font-size', fontSize + 'px')
                        .text(jsonarray[i].sampleName)
                        // .attr("transform", "rotate(-45)")
                        .attr("text-anchor", "middle");
                }
                //是否画出border
                let isDrawBorderStatus = drawBorder ? '#ccc' : 'none';
                for (var j = 0; j < jsonarray[i].geneList.length; j++) {
                    //计算每个rect的位置并根据value填充颜色
                    svg_g_temp
                        .append("rect")
                        .attr("class", "heatmap_rect")
                        .attr("x", 0 + i * heatmap_one_rect_width)
                        .attr("y", 0 + j * heatmap_one_rect_height)
                        .attr("width", heatmap_one_rect_width)
                        .attr("height", heatmap_one_rect_height)
                        .attr("fill", colorscale(jsonarray[i].geneList[j].value))
                        .style('stroke', isDrawBorderStatus)
                        .append("title")
                        .text(
                        "gene: " +
                        jsonarray[i].geneList[j].geneID +
                        "\n" +
                        "value: " +
                        jsonarray[i].geneList[j].value
                        );
                }
            }

            //画图例
            //为图例定义线性填充模型
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

            //画图例矩形
            svg_heatmap_legend_g
                .append("rect")
                .attr("width", heatmap_legend_width)
                .attr("height", heatmap_legend_height)
                .attr("fill", "url(#" + linearGradient.attr("id") + ")");
            //根据高度定义Y轴缩放比例尺
            var yScale = d3
                .scaleLinear()
                .range([heatmap_legend_height - 1, 0])
                .clamp(true)
                //设置定义域
                .domain([min, max]);
            //根据数据设置Y轴
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
