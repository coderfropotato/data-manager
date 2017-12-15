/**
 *  @classdesc tools.js 提供画图和图下载方法
 *  @desc 画图
 *  @example
    *  @func tools.setWrap(wrap) @param {String,".wrap"} 
    *  @func tools.setType(type) @param {String,"heatmap"} 
    *  @func tools.draw(data,options) @param {Object,Object} data - 画图数据  options - 画图参数
    @example
       @func tools.setWrap(wrap) @param {String,".container"}
       @func tools.setType(type) @param {String,"svgDownload"}
       @func tools.download()
 */

let d3 = require('d3');
let venn = require('venn.js');
let $ = require('jquery');
let func = {
    // 画图方法
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
        let temp = config.cubeSize.split('*');

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
                    cluster_height = (height * 0.85 - 90);
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

            heatmap_width = width * 0.60;
            heatmap_height = height * 0.85 - 40 - 50;
            heatmap_one_rect_width = heatmap_width / jsonarray[0].list.length;
            heatmap_one_rect_height = heatmap_height / jsonarray.length;

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
                .attr("transform", "translate(" + (width * 0.1 + 8) + "," + (heatmap_height + 96 + 8) + ")");

            for (var k = 0; k < jsonarray[0].list.length; k++) {
                svg_column.append('g')
                    .attr('transform', "translate(" + (k * heatmap_one_rect_width + heatmap_one_rect_width / 2) + ", 0)")
                    .append('text')
                    .attr("transform", "rotate(90)")
                    .style('text-anchor', 'left')
                    .style('font-size', fontSize + 'px')
                    .style('dominant-baseline', 'middle')
                    .text(jsonarray[0].list[k].name)
            }

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
    venn(data, config, wrap) {
        var title = config.projectName || 'venn';
        var div = d3.select(wrap)
        var width = $(wrap).width() * 0.6;
        var height = $(wrap).height() * 0.7;
        var chart = venn.VennDiagram().width(width).height(height);
        div.datum(data).call(chart);

        var tooltip = d3.select(wrap).append("div")
            .attr("class", "venntooltip");

        div.select('svg .venn_title').remove();
        div.select('svg').append('text')
            .attr('x', width / 2).attr('y', 20)
            .attr('class', 'venn_title')
            .attr('text-anchor', 'middle')
            .text(title);
        div.selectAll("g")
            .on("mouseover", function (d, i) {
                venn.sortAreas(div, d);
                tooltip.transition().duration(400).style("opacity", .8);
                tooltip.html(`number:${d.size}<br>elements:${d.elements.length ? d.elements.join(',') : null}<br>logicalNumber:${d.logicalNumber}<br>sets:${d.sets.join(',')}`);
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 3)
                    .style('stroke', '#fff')
                    .style("fill-opacity", 0.5)
                    .style("stroke-opacity", 1);
            })

            .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX - 180) + "px")
                    .style("top", (d3.event.pageY - 40) + "px");
            })

            .on("mouseout", function (d, i) {
                tooltip.transition().duration(400).style("opacity", 0);
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 0)
                    .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                    .style("stroke-opacity", 0);
            })

            .on('click', function (d, i) {
                config.callback && config.callback(d, i);
            })

    },
    vennStander(data, config, wrap) {
        $(wrap).html('');
        WNTOptions = {
            charData: data.data,
            titleName: [],
            data: []
        };

        var InitAreaClick = function () {
            $("#div_6_4 .pathLinkArea path").off("mouseover mouseout click");
            $(wrap).find(".pathLinkArea path").on("mouseover", function () {
                $(this).attr('opacity', 0.5);
            });

            $(wrap).find(".pathLinkArea path").on("mouseout", function () {
                $(this).attr('opacity', 0.0);
            });

            $(wrap).find(".pathLinkArea path").on("click", function () {
                var $this = $(this);
                areaIndex = $this.attr("areaindex");
                var graphIndex = $this.attr("graphIndex");
            });
        }

        //组间分析 数据 列表组数据
        var controlGroupList = [];
        //比较组目前选中数量
        var compareGroup = data.compareGroup;
        var groupKeyArray = GetGroupKeyArray();
        Draw_WNT();

        function Draw_WNT() {
            //根据选中的比较组获得交叉key集合
            var vennHtml = '';
            switch (compareGroup.length) {
                case 2:
                    vennHtml = `
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="850"
                            height="300px" viewBox="0 0 850 300" enable-background="new 0 0 850 300" xml:space="preserve"
                            style="background-color:#fff;">
                            <g>
                                <g>
                                    <!--底图-->
                                    <circle opacity="0.5" fill="#FFD136" cx="211.483" cy="132.905" r="127" />
                                    <circle opacity="0.5" fill="#4DB8E6" cx="339.535" cy="132.905" r="127" />
                                </g>
                                <g>

                                    <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 149 135)" font-family="Arial" font-size="24">${GetWntValue(groupKeyArray[0])}</text>
                                    <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 274 135)" font-family="Arial" font-size="24">${GetWntValue(groupKeyArray[2])}</text>
                                    <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 402 135)" font-family="Arial" font-size="24">${GetWntValue(groupKeyArray[1])}</text>
                                </g>
                                <g class="pathLinkArea">
                                    <path areaindex="${groupKeyArray[0]}" graphindex="2" opacity="0" fill="#fff" stroke="#22CB22" stroke-miterlimit="10" d="M212.534,132.905c0-46.789,25.307-87.661,62.975-109.694
                        c-18.8-10.997-40.675-17.306-64.026-17.306c-70.14,0-127,56.859-127,127s56.86,127,127,127c23.352,0,45.227-6.309,64.026-17.306
                        C237.841,220.566,212.534,179.694,212.534,132.905z" />

                                    <path areaindex="${groupKeyArray[2]}" graphindex="2" opacity="0" fill="#fff" stroke="#22CB22" stroke-miterlimit="10" d="M212.535,132.905c0,46.789,25.307,87.661,62.974,109.694
                        c37.668-22.033,62.975-62.905,62.975-109.694S313.177,45.244,275.509,23.21C237.842,45.244,212.535,86.116,212.535,132.905z"
                                    />
                                    <path areaindex="${groupKeyArray[1]}" graphindex="2" opacity="0" fill="#fff" stroke="#22CB22" stroke-miterlimit="10" d="M339.534,5.905c-23.352,0-45.227,6.309-64.025,17.306
                        c37.667,22.033,62.974,62.905,62.974,109.694s-25.307,87.661-62.974,109.694c18.799,10.997,40.674,17.306,64.025,17.306
                        c70.14,0,127-56.859,127-127S409.674,5.905,339.534,5.905z" />
                                </g>
                                <g>
                                    <g>
                                        <!--图例-->
                                        <rect opacity="0.5" width="28" height="20" fill="#FFD136" x="510.483" y="30.905" />
                                        <rect opacity="0.5" width="28" height="20" fill="#4DB8E6" x="510.483" y="60.905" />
                                    </g>
                                    <g>
                                        <text x="550" y="45.905" fill="#333" font-size="12" font-weight="bold">${compareGroup[0]}</text>
                                        <text x="550" y="75.905" fill="#333" font-size="12" font-weight="bold">${compareGroup[1]}</text>
                                    </g>
                                </g>
                            </g>
                        </svg>`;
                    break;
                case 3:
                    vennHtml = `
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800" height="450px" viewBox="0 0 600 450" xml:space="preserve">
                            <g transform="matrix(1 0 0 1 50 45)">
                                <circle opacity="0.5" fill="#A47BB5" cx="183.537" cy="225.025" r="121.429"></circle>
                                <circle opacity="0.5" fill="#EED249" cx="121.429" cy="121.429" r="121.429"></circle>
                                <circle opacity="0.5" fill="#51B8D5" cx="242.857" cy="121.429" r="121.429"></circle>
                            </g>
                            <g>
                            <!-- 1 -->
                            <text transform="matrix(1 0 0 1 115 143)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[0])}</text>
                            <!-- 2 -->
                            <text transform="matrix(1 0 0 1 233 122)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[3])}</text>
                            <!-- 3 -->
                            <text transform="matrix(1 0 0 1 350 143)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[1])}</text>
                            <!-- 4 -->
                            <text transform="matrix(1 0 0 1 155 255)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[4])}</text>
                            <!-- 5 -->
                            <text transform="matrix(1 0 0 1 233 202)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[6])}</text>
                            <!-- 6 -->
                            <text transform="matrix(1 0 0 1 310 255)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[5])}</text>
                            <!-- 7 -->
                            <text transform="matrix(1 0 0 1 232 331)" width="100" height="30" text-anchor="middle" font-size="22">${GetWntValue(groupKeyArray[2])}</text>
                            </g>

                            <g class="pathLinkArea">
                                            <path areaindex="${groupKeyArray[0]}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M112.417,271.359c0-44.371,23.804-83.178,59.334-104.363c0.277-44.623,24.614-83.538,60.702-104.413
                                    c-17.861-10.333-38.597-16.249-60.715-16.249c-67.063,0-121.429,54.365-121.429,121.429c0,45.529,25.062,85.198,62.138,105.984
                                    C112.431,272.952,112.417,272.157,112.417,271.359z" />

                                            <!-- 2 -->
                                            <path areaindex="${groupKeyArray[3]}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M233.607,150.056c21.53,0,41.748,5.611,59.281,15.438c-0.851-43.94-25.025-82.166-60.674-102.787
                                    c-36.088,20.875-60.425,59.79-60.702,104.413C189.682,156.286,210.916,150.056,233.607,150.056z" />

                                            <!-- 3 -->
                                            <path areaindex="${groupKeyArray[1]}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M292.167,46.334c-22.119,0-42.854,5.916-60.715,16.249c35.647,20.621,59.823,58.847,60.674,102.787
                                    c37.083,20.785,62.149,60.457,62.149,105.989c0,0.256-0.01,0.51-0.01,0.765c35.527-21.186,59.33-59.991,59.33-104.361
                                    C413.596,100.699,359.23,46.334,292.167,46.334z" />
                                            <!-- 4 -->
                                            <path areaindex="${GetWntValue(groupKeyArray[4])}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M171.79,166.885c0-0.256,0.008-0.509,0.01-0.765c-35.528,21.187-59.331,59.991-59.331,104.361
                                    c0,0.798,0.015,1.593,0.03,2.388c17.536,9.831,37.757,15.444,59.291,15.444c22.118,0,42.854-5.916,60.715-16.249
                                    C196.209,251.069,171.79,211.83,171.79,166.885z" />
                                            <!-- 5 -->
                                            <path areaindex="${groupKeyArray[6]}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M171.5,167.12c-0.002,0.256-0.014,0.51-0.014,0.767c0,44.945,24.42,84.185,60.715,105.18
                                    c36.295-20.995,60.715-60.234,60.715-105.18c0-0.801-0.025-1.596-0.041-2.393c-17.533-9.827-37.75-15.438-59.281-15.438
                                    C210.902,150.056,189.668,156.286,171.5,167.12z" />
                                            <!-- 6 -->
                                            <path areaindex="${GetWntValue(groupKeyArray[5])}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M292.203,165.31c0.016,0.795,0.03,1.589,0.03,2.387c0,44.945-24.42,84.185-60.715,105.18
                                    c17.86,10.333,38.597,16.249,60.715,16.249c22.693,0,43.927-6.231,62.097-17.067c0.002-0.255,0.01-0.509,0.01-0.765
                                    C354.34,225.765,329.279,186.096,292.203,165.31z" />
                                            <!-- 7 -->
                                            <path areaindex="${groupKeyArray[2]}" graphindex="3" opacity="0" fill="#fff" stroke="#22CB22" d="M292.83,288.191c-22.118,0-42.854-5.916-60.715-16.249c-17.861,10.333-38.597,16.249-60.715,16.249
                                    c-21.534,0-41.754-5.612-59.29-15.444c1.273,65.959,55.134,119.042,121.397,119.042c66.809,0,121.008-53.955,121.42-120.665
                                    C336.756,281.96,315.521,288.191,292.83,288.191z" />
                                </g>
                                <g>
                                    <rect opacity="0.5" width="28" height="20" fill="#EED249" x="460" y="60"></rect>
                                    <rect opacity="0.5" width="28" height="20" fill="#A47BB5" x="460" y="85"></rect>
                                    <rect opacity="0.5" width="28" height="20" fill="#51B8D5" x="460" y="110"></rect>
                                </g>
                                <g>
                                    <text x="498" y="75" fill="#333" font-weight="bold" font-size="12">${compareGroup[0]}</text>
                                    <text x="498" y="100" fill="#333" font-weight="bold" font-size="12">${compareGroup[1]}</text>
                                    <text x="498" y="125" fill="#333" font-weight="bold" font-size="12">${compareGroup[2]}</text>
                                </g>
                            </svg>`;



                    break;
                case 4:
                    vennHtml = `
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="900" height="400px" viewBox="0 0 900 400" enable-background="new 0 0 900 400" xml:space="preserve">
                        <g transform="matrix(1 0 0 1 53 40.5)">
                                    <ellipse transform="matrix(0.7062 -0.708 0.708 0.7062 -90.7325 165.0259)" opacity="0.42" fill="#FF8900" cx="153.48" cy="191.84"
                                        rx="108.558" ry="187.758" />
                                    <ellipse transform="matrix(-0.7062 -0.708 0.708 -0.7062 394.2766 545.2882)" opacity="0.42" fill="#FF0000" cx="310.274" cy="190.84"
                                        rx="108.558" ry="187.758" />
                                    <path opacity="0.42" fill="#0000FF" d="M173.894,81.27c-69.856,69.758-100.813,152.074-69.146,183.87
                            c31.669,31.791,113.969,1.018,183.827-68.738c69.858-69.759,100.813-152.076,69.145-183.867
                            C326.053-19.259,243.75,11.516,173.894,81.27z" />
                                    <path opacity="0.42" fill="#00DF12" d="M290.272,81.271c69.856,69.758,100.813,152.074,69.145,183.869
                            c-31.669,31.791-113.969,1.018-183.826-68.738C105.734,126.645,74.778,44.327,106.446,12.536
                            C138.113-19.259,220.415,11.517,290.272,81.271z" />
                        </g>
            
                        <g>
                            <!--1-->
                            <text transform="matrix(1 0 0 1 213 81)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[1])}</text>
                            <!--2-->
                            <text transform="matrix(1 0 0 1 288 122)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[7])}</text>
                            <!--3-->
                            <text transform="matrix(1 0 0 1 363 81)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[2])}</text>
                            <!--4-->
                            <text transform="matrix(1 0 0 1 194 133)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[4])}</text>
                            <!--5-->
                            <text transform="matrix(1 0 0 1 233 177)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[10])}</text>
                            <!--6-->
                            <text transform="matrix(1 0 0 1 288 231)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[14])}</text>
                            <!--7-->
                            <text transform="matrix(1 0 0 1 342 177)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[13])}</text>
                            <!--8-->
                            <text transform="matrix(1 0 0 1 382 133)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[9])}</text>
                            <!--9-->
                            <text transform="matrix(1 0 0 1 118 182)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[0])}</text>
                            <!--10-->
                            <text transform="matrix(1 0 0 1 180 264)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[5])}</text>
                            <!--11-->
                            <text transform="matrix(1 0 0 1 242 289)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[12])}</text>
                            <!--12-->
                            <text transform="matrix(1 0 0 1 329 289)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[11])}</text>
                            <!--13-->
                            <text transform="matrix(1 0 0 1 384 264)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[8])}</text>
                            <!--14-->
                            <text transform="matrix(1 0 0 1 451 183)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[3])}</text>
                            <!--15-->
                            <text transform="matrix(1 0 0 1 282 342)" width="100" height="30" text-anchor="middle" font-family="Arial" font-size="22">${GetWntValue(groupKeyArray[6])}</text>
                        </g>
                            <!-- 1 -->
                        <g class="pathLinkArea">
                                <path areaindex="${groupKeyArray[1]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M285.584,74.533c-52.467-34.055-102.4-44.084-125.352-20.971c-6.805,6.854-10.675,16.059-11.863,26.979
                        c26.897,3.836,56.725,15.727,85.879,34.703C251.063,99.322,268.458,85.65,285.584,74.533z" />
                                <!-- 2 -->
                                <path areaindex="${groupKeyArray[7]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M283.371,155.149c0.477,0.472,0.942,0.947,1.415,1.421c0.799-0.808,1.587-1.619,2.397-2.421
                        c15.598-15.429,32.105-28.689,48.841-39.621c-16.563-15.594-33.675-29.011-50.526-39.949c-17.125,11.116-34.52,24.79-51.334,40.71
                        C251.025,126.265,267.66,139.607,283.371,155.149z" />
                                <!-- 3 -->
                                <path areaindex="${groupKeyArray[2]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M335.993,114.526c29.384-19.191,59.468-31.185,86.56-34.988c-1.317-10.462-5.15-19.303-11.736-25.936
                        c-22.951-23.113-72.885-13.085-125.352,20.971C302.317,85.511,319.428,98.929,335.993,114.526z" />
                                <!-- 4 -->
                                <path areaindex="${groupKeyArray[4]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M227.374,121.849c2.261-2.245,4.536-4.448,6.821-6.612
                        c-29.154-18.978-58.981-30.867-85.879-34.704c-2.785,25.594,9.207,60.613,32.837,96.875
                        C193.666,158.776,209.207,139.889,227.374,121.849z" />
                                <!-- 5 -->
                                <path areaindex="${groupKeyArray[10]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M284.792,156.563c-0.471-0.472-0.93-0.948-1.404-1.418c-15.712-15.543-32.349-28.883-49.209-39.859
                        c-2.285,2.164-4.561,4.367-6.821,6.612c-18.167,18.04-33.708,36.927-46.221,55.559c12.592,19.323,28.483,38.995,47.224,57.787
                        C241.091,208.599,260.153,181.443,284.792,156.563z" />
                                <!-- 6 -->
                                <path areaindex="${groupKeyArray[14]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M228.254,235.256c0.458,0.46,0.91,0.921,1.372,1.379c18.132,18.006,37.09,33.391,55.774,45.761
                        c18.686-12.369,37.644-27.754,55.776-45.761c0.256-0.254,0.503-0.512,0.758-0.766c-12.901-26.881-32.243-54.267-57.244-79.3
                        C260.048,181.454,240.982,208.609,228.254,235.256z" />
                                <!-- 7 -->
                                <path areaindex="${groupKeyArray[13]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M341.923,235.866c19.01-18.979,35.116-38.873,47.846-58.409c-12.513-18.632-28.055-37.52-46.223-55.561
                        c-2.527-2.51-5.072-4.963-7.629-7.37c-16.735,10.931-33.245,24.188-48.843,39.617c-0.811,0.802-1.599,1.613-2.397,2.421
                        C309.679,181.597,329.021,208.985,341.923,235.866z" />
                                <!-- 8 -->
                                <path areaindex="${groupKeyArray[9]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M343.621,121.933c18.168,18.041,33.71,36.929,46.223,55.561c23.952-36.758,35.942-72.238,32.708-97.919
                        c-27.092,3.804-57.176,15.797-86.56,34.988C338.549,116.97,341.094,119.423,343.621,121.933z" />
                                <!-- 9 -->
                                <path areaindex="${groupKeyArray[0]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M230.267,363.101c-12.11-12.159-18.656-28.511-20.114-47.361c-22.269,4.099-40.798,0.894-52.414-10.804
                        c-23.282-23.447-12.267-74.423,23.357-127.469c-23.63-36.262-35.622-71.281-32.837-96.875c-30.535-4.355-57.294,1.65-74.99,19.418
                        c-42.303,42.47-16.831,136.02,56.892,208.945c57.965,57.341,128.497,84.849,176.563,73.347
                        C275.58,387.063,248.247,381.152,230.267,363.101z" />
                                <!-- 10 -->
                                <path areaindex="${groupKeyArray[5]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M228.316,235.25c-18.739-18.791-34.642-38.464-47.235-57.788c-35.619,53.044-46.633,104.015-23.352,127.461
                        c11.616,11.697,30.146,14.898,52.413,10.803C208.291,291.79,214.672,263.816,228.316,235.25z" />
                                <!-- 11 -->
                                <path areaindex="${groupKeyArray[12]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M229.688,236.729c-0.461-0.458-0.914-0.919-1.373-1.379c-13.645,28.565-20.025,56.539-18.174,80.476
                        c22.397-4.119,48.579-15.635,75.321-33.337C266.778,270.12,247.82,254.735,229.688,236.729z" />
                                <!-- 12 -->
                                <path areaindex="${groupKeyArray[11]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M341.307,236.583c-18.132,18.006-37.089,33.391-55.773,45.76
                        c26.597,17.605,52.639,29.095,74.955,33.271c1.592-23.805-4.863-51.514-18.43-79.787
                        C341.807,236.079,341.56,236.332,341.307,236.583z" />
                                <!-- 13 -->
                                <path areaindex="${groupKeyArray[8]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M389.894,177.337c-12.732,19.537-28.846,39.433-47.856,58.411c13.566,28.273,20.021,55.982,18.43,79.787
                        c22.43,4.198,41.099,1.023,52.778-10.737C436.526,281.352,425.513,230.381,389.894,177.337z" />
                                <!-- 14 -->
                                <path areaindex="${groupKeyArray[3]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M497.154,98.914c-17.636-17.706-44.271-23.729-74.676-19.46c3.234,25.681-8.756,61.161-32.708,97.92
                        c35.622,53.045,46.638,104.02,23.355,127.466c-11.68,11.761-30.348,14.938-52.778,10.736c-1.291,19.301-7.853,36.04-20.191,48.429
                        c-9.041,9.076-20.451,15.075-33.516,18.201c42.13-6.44,91.236-32.417,133.622-74.347
                        C513.985,234.933,539.457,141.383,497.154,98.914z" />
                                <!-- 15 -->
                                <path areaindex="${groupKeyArray[6]}" graphindex="4" opacity="0" fill="#fff" stroke="#22CB22" d="M285.459,282.41c-26.741,17.7-52.921,29.216-75.318,33.336c1.458,18.851,8.001,35.202,20.112,47.362
                        c17.98,18.051,45.313,23.962,76.457,19.201c13.064-3.126,24.475-9.125,33.516-18.201c12.338-12.388,18.893-29.13,20.182-48.43
                        C338.093,311.5,312.054,300.016,285.459,282.41z" />
                            </g>
                            <g>
                                <rect opacity="0.5" width="28" height="20" fill="#FF8900" x="560" y="110"></rect>
                                <rect opacity="0.5" width="28" height="20" fill="#00DF12" x="560" y="60"></rect>
                                <rect opacity="0.5" width="28" height="20" fill="#0000FF" x="560" y="85"></rect>
                                <rect opacity="0.5" width="28" height="20" fill="#FF0000" x="560" y="135"></rect>
                            </g>
                            <g>
                                <text font-weight="bold" fill="#FF8900" x="600" y="125" font-size="12">${compareGroup[0]}</text>
                                <text font-weight="bold" fill="#00DF12" x="600" y="75" font-size="12">${compareGroup[1]}</text>
                                <text font-weight="bold" fill="#0000FF" x="600" y="102" font-size="12">${compareGroup[2]}</text>
                                <text font-weight="bold" fill="#FF0000" x="600" y="152" font-size="12">${compareGroup[3]}</text>
                            </g>
                        </svg>`
                    break;
                case 5:
                    vennHtml = `
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"    x="0px" y="0px" width="1000"
                            height="750px" style="background-color:#fff; margin:0 auto;" viewBox="-50 0 1000 750" enable-background="new -20 0 1000 750"
                            xml:space="preserve">
                            <g>
                                <!-- 浅红3 -->
                                <!-- 形状 -->
                                <path opacity="0.5" fill="#D04321" d="M744.377,408.766c12.014-93.332-65.949-180.281-174.135-194.207
                            c-47.596-6.125-93.107,2.91-130.184,22.893c-19.551,9.549-59.568,25.896-78.201,24.957
                            c-110.932-5.598-182.358,14.537-189.918,73.291c-7.564,58.752,57.295,100.137,168.317,122.498
                            c17.586,3.543,49.037,24.854,65.695,38.627c8.199,7.715,17.18,14.828,26.854,21.229c2.148,1.471,4.281,2.834,6.398,4.068
                            c25.391,15.506,55.104,26.25,87.537,30.426C634.924,566.471,732.361,502.098,744.377,408.766z"
                                />
                                <!-- 边框 -->
                                <path fill="none" stroke="#D01333" stroke-width="5" stroke-miterlimit="10" d="M744.377,408.766
                            c12.014-93.332-65.949-180.281-174.135-194.207c-47.596-6.125-93.107,2.91-130.184,22.893
                            c-19.551,9.549-59.568,25.896-78.201,24.957c-110.932-5.598-182.358,14.537-189.918,73.291
                            c-7.564,58.752,57.295,100.137,168.317,122.498c17.586,3.543,49.037,24.854,65.695,38.627c8.199,7.715,17.18,14.828,26.854,21.229
                            c2.148,1.471,4.281,2.834,6.398,4.068c25.391,15.506,55.104,26.25,87.537,30.426C634.924,566.471,732.361,502.098,744.377,408.766z"
                                />
                                <!-- 蓝4 -->
                                <!-- 形状 -->
                                <path opacity="0.5" fill="#335F9F" d="M424.244,682.709c92.699-16.182,152.645-116.406,133.889-223.859
                            c-8.254-47.273-30.367-88.063-60.439-117.555c-14.912-15.844-42.385-49.221-47.008-67.295
                            c-27.523-107.609-67.918-169.859-126.273-159.672c-58.356,10.184-78.664,84.393-67.124,197.055
                            c1.826,17.846-9.208,54.201-17.426,74.189c-4.939,10.119-9.072,20.803-12.32,31.939c-0.766,2.488-1.437,4.93-1.988,7.316
                            c-7.287,28.846-8.744,60.408-3.123,92.619C241.189,624.9,331.543,698.889,424.244,682.709z"
                                />
                                <!-- 边框 -->
                                <path fill="none" stroke="#324D8E" stroke-width="4" stroke-miterlimit="10" d="M424.244,682.709
                            c92.699-16.182,152.645-116.406,133.889-223.859c-8.254-47.273-30.367-88.063-60.439-117.555
                            c-14.912-15.844-42.385-49.221-47.008-67.295c-27.523-107.609-67.918-169.859-126.273-159.672
                            c-58.356,10.184-78.664,84.393-67.124,197.055c1.826,17.846-9.208,54.201-17.426,74.189c-4.939,10.119-9.072,20.803-12.32,31.939
                            c-0.766,2.488-1.437,4.93-1.988,7.316c-7.287,28.846-8.744,60.408-3.123,92.619C241.189,624.9,331.543,698.889,424.244,682.709z"
                                />
                                <!-- 绿5 -->
                                <!-- 形状 -->
                                <path opacity="0.5" fill="#1EA43C" d="M68.777,468.438c45.929,82.131,160.34,105.555,255.543,52.313
                            c41.881-23.422,73.063-57.783,90.949-95.918c10.018-19.311,32.432-56.277,47.959-66.617
                            c92.449-61.566,137.836-120.277,108.924-171.979c-28.912-51.703-105.662-46.324-208.166,1.828
                            c-16.238,7.625-54.197,9.236-75.78,8.092c-11.183-1.314-22.631-1.682-34.215-1.063c-2.602,0.1-5.128,0.275-7.563,0.543
                            c-29.633,2.664-59.901,11.729-88.44,27.686C62.787,276.564,22.847,386.305,68.777,468.438z"
                                />
                                <!-- 边框 -->
                                <path fill="none" stroke="#095A30" stroke-width="5" stroke-miterlimit="10" d="M68.777,468.438
                            c45.929,82.131,160.34,105.555,255.543,52.313c41.881-23.422,73.063-57.783,90.949-95.918
                            c10.018-19.311,32.432-56.277,47.959-66.617c92.449-61.566,137.836-120.277,108.924-171.979
                            c-28.912-51.703-105.662-46.324-208.166,1.828c-16.238,7.625-54.197,9.236-75.78,8.092c-11.183-1.314-22.631-1.682-34.215-1.063
                            c-2.602,0.1-5.128,0.275-7.563,0.543c-29.633,2.664-59.901,11.729-88.44,27.686C62.787,276.564,22.847,386.305,68.777,468.438z"
                                />
                                <!-- 黄1 -->
                                <!-- 形状 -->
                                <path opacity="0.5" fill="#F7F4AC" d="M162.166,54.322c-64.101,68.893-51.329,184.975,28.529,259.277
                            c35.132,32.688,77.396,51.836,119.18,57.172c21.451,3.617,63.508,13.621,78.109,25.232c86.939,69.129,156.734,94.338,197.086,50.967
                            c40.354-43.367,11.709-114.773-65.545-197.584c-12.234-13.121-25.402-48.758-30.93-69.652c-2.176-11.047-5.336-22.057-9.475-32.895
                            c-0.893-2.445-1.834-4.797-2.834-7.031c-11.619-27.391-29.523-53.424-53.463-75.697C342.965-10.19,226.267-14.571,162.166,54.322z"
                                />
                                <!-- 边框 -->
                                <path fill="none" stroke="#F2E971" stroke-width="5" stroke-miterlimit="10" d="M162.166,54.322
                            c-64.101,68.893-51.329,184.975,28.529,259.277c35.132,32.688,77.396,51.836,119.18,57.172
                            c21.451,3.617,63.508,13.621,78.109,25.232c86.939,69.129,156.734,94.338,197.086,50.967
                            c40.354-43.367,11.709-114.773-65.545-197.584c-12.234-13.121-25.402-48.758-30.93-69.652c-2.176-11.047-5.336-22.057-9.475-32.895
                            c-0.893-2.445-1.834-4.797-2.834-7.031c-11.619-27.391-29.523-53.424-53.463-75.697C342.965-10.19,226.267-14.571,162.166,54.322z"
                                />
                                <!-- 深红2 -->
                                <!-- 形状 -->
                                <path opacity="0.6" fill="#D26145" d="M577.607,19.381c-85.283-39.771-191.793,8.127-237.893,106.982
                            c-20.281,43.494-25.484,89.602-17.695,130.994c3.166,21.523,6.6,64.617,0.049,82.086c-39,104-41.491,178.168,12.197,203.203
                            c53.686,25.039,112.803-24.203,167.803-123.203c8.711-15.682,38.563-39.182,56.742-50.875c9.838-5.471,19.342-11.869,28.375-19.143
                            c2.055-1.602,4.002-3.221,5.818-4.863c22.48-19.488,41.736-44.539,55.557-74.176C694.66,171.531,662.893,59.152,577.607,19.381z"
                                />

                                <!-- 边框 -->
                                <path fill="none" stroke="#991E34" stroke-width="5" stroke-miterlimit="10" d="M577.607,19.381
                            c-85.283-39.771-191.793,8.127-237.893,106.982c-20.281,43.494-25.484,89.602-17.695,130.994c3.166,21.523,6.6,64.617,0.049,82.086
                            c-39,104-41.491,178.168,12.197,203.203c53.686,25.039,112.803-24.203,167.803-123.203c8.711-15.682,38.563-39.182,56.742-50.875
                            c9.838-5.471,19.342-11.869,28.375-19.143c2.055-1.602,4.002-3.221,5.818-4.863c22.48-19.488,41.736-44.539,55.557-74.176
                            C694.66,171.531,662.893,59.152,577.607,19.381z" />
                            </g>
                            <g>
                                <!-- 1~5 -->
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 240 95)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[0])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 300 167)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[7])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 364 164)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[16])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 418 120)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[5])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 546 95)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[1])}</text>

                                <!-- 6~10 -->
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 211 250)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[8])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 289 238)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[20])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 376 227)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[27])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 461 199)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[17])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 525 192)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[11])}</text>

                                <!-- 11~15 -->
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 224 314)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[19])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 284 320)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[28])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 394 328)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[30])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 487 277)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[26])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 541 247)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[22])}</text>

                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 206 370)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[13])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 269 406)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[24])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 353 432)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[29])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 427 476)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[21])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 476 400)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[25])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 546 345)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[15])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 600 281)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[9])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 125 417)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[4])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 257 492)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[14])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 328 492)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[23])}</text>

                                <!-- 26~30 -->
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 374 526)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[10])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 392 614)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[3])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 505 512)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[12])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 520 446)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[18])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 569 409)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[6])}</text>
                                <text width="100" height="30" text-anchor="middle" transform="matrix(1 0 0 1 668 418)" fill="#000000" font-family="Arial"
                                    font-size="24">${GetWntValue(groupKeyArray[2])}</text>
                            </g>
                            <g class="pathLinkArea">
                                <!-- 1~5 -->
                                <path areaindex="${groupKeyArray[0]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M245.096,194.625c2.445-0.269,4.983-0.443,7.595-0.544c1.814-0.097,3.624-0.16,5.429-0.209
                            c9.153-45.902,30.481-74.563,65.291-80.616c7.516-1.307,14.732-1.415,21.666-0.395c14.66-26.979,33.975-49.678,56.047-67.229
                        c-78.555-57.19-181.725-55.533-240.648,7.573c-44.808,47.988-52.2,118.85-25.519,182.571c6.761-4.798,13.874-9.294,21.322-13.445
                        C184.939,206.36,215.338,197.291,245.096,194.625z" />
                                <path areaindex="${groupKeyArray[7]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M287.043,195.174c8.774,0.464,20.244,0.475,31.873-0.182
                        c2.646-23.234,9.16-46.809,19.855-69.663c1.986-4.244,4.092-8.385,6.295-12.439c-6.932-1.021-14.15-0.913-21.664,0.395
                        c-34.809,6.053-56.138,34.714-65.292,80.616C267.893,193.637,277.564,194.063,287.043,195.174z"
                                />
                                <path areaindex="${groupKeyArray[16]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M318.924,194.962c17.094-0.965,34.525-3.375,44.23-7.917
                        c16.467-7.708,32.268-14.315,47.32-19.774c-18.297-31.579-39.916-50.664-65.398-54.411c-2.203,4.054-4.311,8.195-6.297,12.439
                        C328.086,148.154,321.572,171.728,318.924,194.962z" />
                                <path areaindex="${groupKeyArray[5]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M410.465,167.301c25.578-9.276,48.982-15.218,69.766-17.544
                        c-0.471-1.314-0.957-2.626-1.459-3.937c-0.896-2.447-1.842-4.8-2.848-7.037c-11.668-27.411-29.648-53.463-53.689-75.753
                        c-6.791-6.297-13.854-12.079-21.121-17.37c-22.072,17.552-41.387,40.25-56.047,67.229
                        C370.551,116.637,392.17,135.721,410.465,167.301z" />
                                <path areaindex="${groupKeyArray[1]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M475.934,138.755c1.006,2.235,1.949,4.589,2.848,7.036c0.5,1.31,0.986,2.622,1.459,3.937
                        c43.453-4.861,75.467,6.088,91.967,35.489c5.43,9.675,8.248,19.595,8.639,29.733c28.789,5.035,55.215,15.247,78.109,29.311
                        c30.529-92.145-2.816-189.567-81.27-226.023C520.168-8.49,453.037,4.351,401.123,45.631c7.266,5.291,14.33,11.073,21.121,17.37
                        C446.285,85.292,464.266,111.344,475.934,138.755z" />

                                <!-- 6~10 -->
                                <path areaindex="${groupKeyArray[8]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M253.059,266.636c-0.745-27.465,0.894-51.881,5.052-72.735
                        c-1.805,0.049-3.615,0.114-5.428,0.209c-2.613,0.1-5.149,0.276-7.596,0.544c-29.76,2.665-60.156,11.736-88.817,27.705
                        c-7.449,4.152-14.563,8.647-21.323,13.446c10.385,24.803,25.927,48.522,46.444,69.389
                        C194.826,285.926,219.373,273.42,253.059,266.636z" />
                                <path areaindex="${groupKeyArray[20]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M321.01,256.39c-3.715-19.674-4.48-40.411-2.086-61.428
                        c-11.627,0.657-23.096,0.646-31.872,0.182c-9.48-1.11-19.15-1.537-28.933-1.273c-4.157,20.854-5.798,45.27-5.052,72.736
                        c19.809-3.989,42.771-6.001,68.497-6.247C321.381,258.972,321.193,257.642,321.01,256.39z" />
                                <path areaindex="${groupKeyArray[27]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M361.006,261.261c18.715,0.94,58.902-15.42,78.535-24.976c0.041-0.022,0.082-0.041,0.123-0.063
                        c-8.635-26.989-18.33-50.16-29.199-68.922c-15.051,5.459-30.852,12.065-47.32,19.774c-9.705,4.542-27.137,6.951-44.229,7.917
                        c-2.395,21.017-1.629,41.752,2.084,61.428c0.186,1.25,0.371,2.582,0.557,3.969C334.07,260.272,347.234,260.569,361.006,261.261z"
                                />
                                <path areaindex="${groupKeyArray[17]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M500.707,215.051c-5.275-12.758-9.736-26.262-12.412-36.341
                        c-1.922-9.721-4.607-19.412-8.055-28.982c-20.785,2.326-44.188,8.268-69.766,17.543c10.869,18.763,20.564,41.933,29.197,68.922
                        C458.188,226.265,478.793,219.046,500.707,215.051z" />
                                <path areaindex="${groupKeyArray[11]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M500.699,215.08c22.129-4.034,45.59-4.78,69.582-1.704c3.551,0.455,7.07,0.995,10.557,1.605
                        c-0.391-10.141-3.211-20.06-8.641-29.735c-16.5-29.401-48.514-40.349-91.967-35.489c3.447,9.571,6.133,19.262,8.057,28.982
                        C490.963,188.819,495.422,202.323,500.699,215.08z" />

                                <!-- 11~15 -->
                                <path areaindex="${groupKeyArray[19]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M189.125,312.674c18.483,17.138,38.937,30.55,60.253,40.211
                        c4.477-15.847,7.676-32.185,6.624-42.429c-1.579-15.353-2.559-29.987-2.935-43.849c-33.687,6.784-58.234,19.29-71.669,38.558
                        C183.902,307.71,186.475,310.217,189.125,312.674z" />
                                <path areaindex="${groupKeyArray[28]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M321.557,260.389c-25.725,0.247-48.691,2.257-68.498,6.247
                        c0.376,13.862,1.356,28.496,2.935,43.849c1.052,10.244-2.147,26.582-6.623,42.43c19.371,8.777,39.455,14.46,59.432,17.002
                        c0.395,0.066,0.811,0.139,1.219,0.209c3.264-10.183,6.943-20.706,11.027-31.56C327.244,322.099,324.547,282.891,321.557,260.389z"
                                />
                                <path areaindex="${groupKeyArray[30]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M439.672,236.193c-0.041,0.021-0.082,0.041-0.121,0.063
                        c-19.633,9.555-59.822,25.915-78.535,24.975c-13.771-0.692-26.938-0.99-39.451-0.872c2.99,22.501,5.689,61.71-0.508,78.177
                        c-4.084,10.853-7.764,21.377-11.027,31.56c21.875,3.783,62.83,13.635,77.225,25.043c10.451,8.281,20.652,15.923,30.59,22.903
                        c11.086-20.165,30.863-51.354,44.975-60.721c10.818-7.179,20.984-14.317,30.475-21.413c-15.428-17.029-38.826-46.337-43.07-62.865
                        C446.896,260.085,443.383,247.79,439.672,236.193z" />
                                <path areaindex="${groupKeyArray[26]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M493.285,335.94c23.436-17.518,42.699-34.761,57.133-51.627
                        c-9.254-11.673-19.627-23.646-31.07-35.87c-6.363-6.802-12.979-19.651-18.648-33.363c-21.914,3.996-42.521,11.214-61.035,21.143
                        c3.709,11.596,7.225,23.893,10.551,36.852C454.457,289.603,477.855,318.911,493.285,335.94z" />
                                <path areaindex="${groupKeyArray[22]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M500.707,215.051c5.672,13.711,12.285,26.561,18.65,33.362
                        c11.443,12.225,21.814,24.197,31.07,35.872c20.506-23.965,31.271-47.17,30.418-69.334c-3.484-0.609-7.006-1.148-10.555-1.604
                        C546.299,210.271,522.838,211.017,500.707,215.051z" />

                                <!-- 16~20 -->
                                <path areaindex="${groupKeyArray[13]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M238.493,384.729c3.521-8.529,7.55-20.036,10.878-31.813
                        c-21.317-9.662-41.771-23.074-60.255-40.211c-2.649-2.457-5.223-4.963-7.725-7.51c-5.904,8.47-9.668,18.242-11.11,29.413
                        c-4.41,34.127,15.691,62.398,55.139,84.491c0.228-0.799,0.45-1.597,0.7-2.406C229.382,405.547,233.532,394.855,238.493,384.729z"
                                />
                                <path areaindex="${groupKeyArray[24]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M308.813,369.888c-19.978-2.543-40.063-8.224-59.434-17.003
                        c-3.327,11.778-7.355,23.284-10.877,31.815c-4.96,10.126-9.11,20.818-12.371,31.962c-0.252,0.81-0.473,1.606-0.702,2.406
                        c18.481,10.354,41.216,19.346,67.663,26.949c2.124-22.359,7.93-47.822,16.938-75.921
                        C309.621,370.025,309.207,369.953,308.813,369.888z" />
                                <path areaindex="${groupKeyArray[29]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M378.861,476.617c14.936-16.061,26.973-33.873,35.785-52.6c0.955-1.835,2.025-3.83,3.188-5.946
                        c-9.936-6.979-20.139-14.622-30.588-22.904c-14.396-11.405-55.35-21.258-77.225-25.041c-9.01,28.099-14.816,53.56-16.939,75.923
                        c14.349,4.125,29.781,7.844,46.232,11.146C349.65,459.27,364.756,467.439,378.861,476.617z" />
                                <path areaindex="${groupKeyArray[21]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M414.656,423.988c-8.814,18.729-20.852,36.539-35.787,52.6
                        c9.998,6.506,19.49,13.518,26.428,19.232c7.662,7.186,16.012,13.84,24.963,19.893c16.768-15.463,33.531-36.135,50.043-61.383
                        c-19.32-8.412-40.219-20.668-62.459-36.287C416.68,420.156,415.611,422.152,414.656,423.988z" />
                                <path areaindex="${groupKeyArray[25]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M417.834,418.071c22.24,15.622,43.141,27.876,62.459,36.288
                        c7.23-11.053,14.41-22.977,21.521-35.735c5.17-9.273,17.756-21.278,30.953-31.964c-9.809-17.405-21.764-32.969-35.346-46.241
                        c-1.293-1.368-2.682-2.873-4.137-4.479c-9.49,7.094-19.658,14.235-30.475,21.412C448.697,366.718,428.92,397.905,417.834,418.071z"
                                />

                                <!-- 21~25 -->
                                <path areaindex="${groupKeyArray[15]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M493.293,335.91c1.455,1.607,2.846,3.112,4.137,4.48c13.582,13.271,25.539,28.836,35.348,46.241
                        c9.135-7.397,18.564-14.161,26.031-18.946c9.881-5.478,19.424-11.881,28.496-19.159c0.957-0.741,1.883-1.49,2.791-2.24
                        c-8.988-19.378-22.357-40.161-39.668-62C535.994,301.15,516.73,318.392,493.293,335.91z" />
                                <path areaindex="${groupKeyArray[9]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M550.418,283.632c17.313,21.841,30.682,42.624,39.668,62.001
                        c1.052-0.868,2.075-1.743,3.054-2.625c22.576-19.503,41.913-44.572,55.793-74.231c3.89-8.311,7.213-16.717,10.014-25.167
                        c-22.894-14.065-49.319-24.276-78.108-29.311C581.688,236.463,570.926,259.67,550.418,283.632z"
                                />
                                <path areaindex="${groupKeyArray[4]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M224.131,423.984c0.375-1.612,0.821-3.257,1.297-4.916
                        c-39.447-22.092-59.548-50.363-55.139-84.492c1.442-11.17,5.206-20.942,11.109-29.412c-20.518-20.867-36.059-44.586-46.442-69.389
                        c-80.01,56.785-110.8,156.062-68.27,231.85c31.418,55.982,94.741,84.697,162.142,80.488c-3.29-10.104-5.932-20.598-7.833-31.441
                        C215.352,484.438,216.815,452.852,224.131,423.984z" />
                                <path areaindex="${groupKeyArray[14]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M293.083,446.049c-26.447-7.604-49.182-16.6-67.663-26.951c-0.476,1.66-0.922,3.304-1.296,4.916
                        c-7.317,28.867-8.78,60.453-3.137,92.688c1.901,10.846,4.542,21.338,7.833,31.441c27.544-1.719,55.766-8.939,82.772-22.047
                        C295.368,508.047,289.784,480.791,293.083,446.049z" />
                                <path areaindex="${groupKeyArray[23]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M378.869,476.588c-14.105-9.18-29.211-17.346-39.545-19.422
                        c-16.451-3.301-31.885-7.021-46.233-11.148c-3.3,34.744,2.286,62,18.51,80.049c3.934-1.908,7.844-3.928,11.719-6.088
                        C344.742,508.041,363.367,493.26,378.869,476.588z" />
                                <!-- 26~30 -->
                                <path areaindex="${groupKeyArray[10]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M378.861,476.617c-15.504,16.67-34.129,31.453-55.551,43.389
                        c-3.875,2.16-7.783,4.182-11.719,6.09c5.834,6.49,13.037,11.795,21.705,15.824c31.117,14.461,64.049,4.16,96.953-26.178
                        c-8.949-6.055-17.299-12.707-24.961-19.893C398.352,490.133,388.857,483.121,378.861,476.617z"
                                />
                                <path areaindex="${groupKeyArray[3]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M438.691,521.137c-2.125-1.236-4.268-2.6-6.426-4.072c-0.674-0.443-1.338-0.9-2.006-1.352
                        c-32.906,30.34-65.838,40.639-96.953,26.178c-8.668-4.029-15.871-9.334-21.705-15.824c-27.006,13.105-55.229,20.33-82.773,22.047
                        c29.341,90.1,111.132,148.5,194.841,133.941c64.299-11.184,112.898-62.494,130.609-128.596c-9.117-0.072-18.357-0.678-27.678-1.873
                        C494.029,547.404,464.191,536.654,438.691,521.137z" />
                                <path areaindex="${groupKeyArray[12]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M480.293,454.359c-16.512,25.25-33.273,45.92-50.043,61.383
                        c0.668,0.451,1.332,0.908,2.008,1.354c2.156,1.471,4.301,2.836,6.424,4.07c25.5,15.518,55.34,26.27,87.91,30.447
                        c9.322,1.197,18.563,1.803,27.68,1.875v-0.002l0,0c7.486-27.947,9.453-58.541,4.746-89.865
                        C537.332,471.344,510.781,467.635,480.293,454.359z" />
                                <path areaindex="${groupKeyArray[18]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M532.777,386.631c-13.197,10.686-25.783,22.69-30.953,31.965
                        c-7.113,12.758-14.293,24.682-21.521,35.734c30.486,13.277,57.039,16.984,78.725,9.262c-0.279-1.852-0.576-3.707-0.9-5.561
                        C553.566,431.996,544.781,407.932,532.777,386.631z" />
                                <path areaindex="${groupKeyArray[6]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M558.799,367.712c-7.467,4.787-16.896,11.552-26.031,18.948
                        c12.006,21.301,20.789,45.365,25.35,71.4c0.326,1.855,0.621,3.711,0.9,5.561c9.725-3.465,18.471-9.219,26.154-17.447
                        c23.363-25.022,23.691-59.374,4.914-99.859c-0.906,0.75-1.834,1.499-2.789,2.241C578.223,355.835,568.68,362.237,558.799,367.712z"
                                />
                                <!-- 31 -->
                                <path areaindex="${groupKeyArray[2]}" graphindex="5" opacity="0" fill="#fff" stroke="#22CB22" d="M658.955,244.262c-2.801,8.45-6.125,16.856-10.014,25.167
                        c-13.881,29.659-33.217,54.728-55.793,74.231c-0.979,0.882-2.004,1.757-3.053,2.625c18.777,40.486,18.449,74.838-4.916,99.857
                        c-7.682,8.229-16.43,13.986-26.152,17.449c4.707,31.324,2.74,61.916-4.748,89.867c97.125,0.777,179.855-60.375,190.885-145.762
                        C753.576,342.574,718.055,280.568,658.955,244.262z" />
                            </g>
                            <g>
                                <rect id="rect1" x="720" y="80" opacity="0.5" width="28" height="20" fill="#D04321"></rect>
                                <rect x="720" y="105" opacity="0.5" width="28" height="20" fill="#335F9F"></rect>
                                <rect x="720" y="130" opacity="0.5" width="28" height="20" fill="#1EA43C"></rect>
                                <rect x="720" y="155" opacity="0.5" width="28" height="20" fill="#F7F4AC"></rect>
                                <rect x="720" y="180" opacity="0.5" width="28" height="20" fill="#D26145"></rect>
                            </g>
                            <g>
                                <text x="760" y="95" font-size="12" font-weight="bold">${compareGroup[3]}</text>
                                <text x="760" y="120" font-size="12" font-weight="bold">${compareGroup[4]}</text>
                                <text x="760" y="145" font-size="12" font-weight="bold">${compareGroup[2]}</text>
                                <text x="760" y="170" font-size="12" font-weight="bold">${compareGroup[0]}</text>
                                <text x="760" y="195" font-size="12" font-weight="bold">${compareGroup[1]}</text>
                            </g>
                        </svg>`
                    break;
            }
            $(wrap).append(vennHtml);
            InitAreaClick();
        };

        //根据key获取对应展示数据
        function GetWntValue(key) {
            var result = "";
            for (var i = 0; i < WNTOptions.charData.length; i++) {
                if (WNTOptions.charData[i].result.SampleNameGroup == key) {

                    result = WNTOptions.charData[i].result.Count;
                    break;
                }
            }
            if (result == "") {
                result = 0;
            }
            return result;
        };

        //获取每个比对组两两之间的交叉数据
        function GetGroupKeyArray() {
            var returnValue = [];
            var tempStr = "";
            for (var i = 1; i <= compareGroup.length; i++) {
                tempStr += combine(compareGroup, i);
            }
            tempStr = tempStr.replace(/,/g, "∩");
            tempStr = tempStr.substring(0, tempStr.length - 1);
            return tempStr.split('&');
        }

        //进行指定数量的排列组合 num为数组中每一项的下标
        function combine(arr, num) {
            var r = "";
            (function f(t, a, n) {
                if (n == 0) {
                    r += t.toString() + "&";
                    return r;
                }
                for (var i = 0, l = a.length; i <= l - n; i++) {
                    f(t.concat(a[i]), a.slice(i + 1), n - 1);
                }
            })([], arr, num);
            return r;
        }
    }
}
let downloadFunc = {
    svgDownload(wrap,filename) {
        var svgXml = $(wrap).find("svg:eq(0)").prop("outerHTML");
        var image = new Image();
        image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
        var canvas = document.createElement('canvas'); 
        canvas.width = $element.find("svg:eq(0)").width();
        canvas.height = $element.find("svg:eq(0)").height();
        var context = canvas.getContext('2d'); 
        image.onload = function () {
            context.drawImage(image, 0, 0);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.href = canvas.toDataURL("image/png"); 
            a.download = fileName; 
            a.click(); 
            a.remove();
        }
    }
}
function Tools() {
    this.type = '';
    this.wrap = '';
    this.drawFunc = func;
    this.downloadFunc = downloadFunc;
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
    var wrap = this.wrap;
    this.drawFunc[this.type](data, newConfig, wrap);
}
Tools.prototype.download = function () {
    this.downloadFunc[this.type](this.wrap);
}


module.exports = new Tools();
