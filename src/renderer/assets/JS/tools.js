let d3 = require('d3');
let venn = require('venn.js');
let $ = require('jquery');
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
    vennLayout() {
        WNTOptions = {
            chartPanelID: "div_WNT_Panel",
            charData: [],
            isTwoShow: false,
            isThreeShow: false,
            isFourShow: false,
            isFiveShow: false,
            titleName: [],
            data: []
        };

        InitAreaClick = function () {
            //初始化热点 鼠标 移上/离开 效果
            $("#div_6_4 .pathLinkArea path").off("mouseover mouseout click");
            $("#div_6_4 .pathLinkArea path").on("mouseover", function () {
                $(this).attr('opacity', 0.5);
            });

            $("#div_6_4 .pathLinkArea path").on("mouseout", function () {
                $(this).attr('opacity', 0.0);
            });

            $("#div_6_4 .pathLinkArea path").on("click", function () {
                var $this = $(this);
                areaIndex = $this.attr("areaindex");
                var graphIndex = $this.attr("graphIndex");
                GetWNTData(1);
            });
        }

        //组间分析 数据 列表组数据
        var controlGroupList = [];
        //比较组目前选中数量
        var compareGroup = [];
        var groupKeyArray = [];

        WNTOptions.charData = responseData;
        Draw_WNT();

        var WNT2 = {};
        var WNT3 = {};
        var WNT4 = {};
        var WNT5 = {};

        var Draw_WNT = function () {
            //根据选中的比较组获得交叉key集合
            groupKeyArray = GetGroupKeyArray();
            isTwoShow = false;
            isThreeShow = false;
            isFourShow = false;
            isFiveShow = false;
            switch (compareGroup.length) {
                case 2:
                    isTwoShow = true;//两个园图的显示
                    WNT2.titleName1 = compareGroup[0];//图例说明1
                    WNT2.titleName2 = compareGroup[1];//图例说明2
                    WNT2.A = GetWntValue(groupKeyArray[0]);//图1部分
                    WNT2.AKey = groupKeyArray[0];
                    WNT2.B = GetWntValue(groupKeyArray[1]);//图2部分
                    WNT2.BKey = groupKeyArray[1];
                    WNT2.AB = GetWntValue(groupKeyArray[2]);//图1，图2 公共部分
                    WNT2.ABKey = groupKeyArray[2];
                    break;
                case 3:
                    isThreeShow = true;
                    WNT3.titleName1 = compareGroup[0];
                    WNT3.titleName2 = compareGroup[1];
                    WNT3.titleName3 = compareGroup[2];
                    WNT3.A = GetWntValue(groupKeyArray[0]);
                    WNT3.AKey = groupKeyArray[0];
                    WNT3.B = GetWntValue(groupKeyArray[1]);
                    WNT3.BKey = groupKeyArray[1];
                    WNT3.C = GetWntValue(groupKeyArray[2]);
                    WNT3.CKey = groupKeyArray[2];
                    WNT3.AB = GetWntValue(groupKeyArray[3]);
                    WNT3.ABKey = groupKeyArray[3];
                    WNT3.AC = GetWntValue(groupKeyArray[4]);
                    WNT3.ACKey = groupKeyArray[4];
                    WNT3.BC = GetWntValue(groupKeyArray[5]);
                    WNT3.BCKey = groupKeyArray[5];
                    WNT3.ABC = GetWntValue(groupKeyArray[6]);
                    WNT3.ABCKey = groupKeyArray[6];
                    //$log.log(WNT3);
                    break;
                case 4:
                    isFourShow = true;
                    WNT4.titleName1 = compareGroup[0];
                    WNT4.titleName2 = compareGroup[1];
                    WNT4.titleName3 = compareGroup[2];
                    WNT4.titleName4 = compareGroup[3];
                    WNT4.A = GetWntValue(groupKeyArray[0]);
                    WNT4.AKey = groupKeyArray[0];
                    WNT4.B = GetWntValue(groupKeyArray[1]);
                    WNT4.BKey = groupKeyArray[1];
                    WNT4.C = GetWntValue(groupKeyArray[2]);
                    WNT4.CKey = groupKeyArray[2];
                    WNT4.D = GetWntValue(groupKeyArray[3]);
                    WNT4.DKey = groupKeyArray[3];
                    WNT4.AB = GetWntValue(groupKeyArray[4]);
                    WNT4.ABKey = groupKeyArray[4];
                    WNT4.AC = GetWntValue(groupKeyArray[5]);
                    WNT4.ACKey = groupKeyArray[5];
                    WNT4.AD = GetWntValue(groupKeyArray[6]);
                    WNT4.ADKey = groupKeyArray[6];
                    WNT4.BC = GetWntValue(groupKeyArray[7]);
                    WNT4.BCKey = groupKeyArray[7];
                    WNT4.BD = GetWntValue(groupKeyArray[8]);
                    WNT4.BDKey = groupKeyArray[8];
                    WNT4.CD = GetWntValue(groupKeyArray[9]);
                    WNT4.CDKey = groupKeyArray[9];
                    WNT4.ABC = GetWntValue(groupKeyArray[10]);
                    WNT4.ABCKey = groupKeyArray[10];
                    WNT4.ABD = GetWntValue(groupKeyArray[11]);
                    WNT4.ABDKey = groupKeyArray[11];
                    WNT4.ACD = GetWntValue(groupKeyArray[12]);
                    WNT4.ACDKey = groupKeyArray[12];
                    WNT4.BCD = GetWntValue(groupKeyArray[13]);
                    WNT4.BCDKey = groupKeyArray[13];
                    WNT4.ABCD = GetWntValue(groupKeyArray[14]);
                    WNT4.ABCDKey = groupKeyArray[14];
                    break;
                case 5:
                    isFiveShow = true;
                    WNT5.titleName1 = compareGroup[0];
                    WNT5.titleName2 = compareGroup[1];
                    WNT5.titleName3 = compareGroup[2];
                    WNT5.titleName4 = compareGroup[3];
                    WNT5.titleName5 = compareGroup[4];
                    WNT5.A = GetWntValue(groupKeyArray[0]);
                    WNT5.AKey = groupKeyArray[0];
                    WNT5.B = GetWntValue(groupKeyArray[1]);
                    WNT5.BKey = groupKeyArray[1];
                    WNT5.C = GetWntValue(groupKeyArray[2]);
                    WNT5.CKey = groupKeyArray[2];
                    WNT5.D = GetWntValue(groupKeyArray[3]);
                    WNT5.DKey = groupKeyArray[3];
                    WNT5.E = GetWntValue(groupKeyArray[4]);
                    WNT5.EKey = groupKeyArray[4];
                    WNT5.AB = GetWntValue(groupKeyArray[5]);
                    WNT5.ABKey = groupKeyArray[5];
                    WNT5.AC = GetWntValue(groupKeyArray[6]);
                    WNT5.ACKey = groupKeyArray[6];
                    WNT5.AD = GetWntValue(groupKeyArray[7]);
                    WNT5.ADKey = groupKeyArray[7];
                    WNT5.AE = GetWntValue(groupKeyArray[8]);
                    WNT5.AEKey = groupKeyArray[8];
                    WNT5.BC = GetWntValue(groupKeyArray[9]);
                    WNT5.BCKey = groupKeyArray[9];
                    WNT5.BD = GetWntValue(groupKeyArray[10]);
                    WNT5.BDKey = groupKeyArray[10];
                    WNT5.BE = GetWntValue(groupKeyArray[11]);
                    WNT5.BEKey = groupKeyArray[11];
                    WNT5.CD = GetWntValue(groupKeyArray[12]);
                    WNT5.CDKey = groupKeyArray[12];
                    WNT5.CE = GetWntValue(groupKeyArray[13]);
                    WNT5.CEKey = groupKeyArray[13];
                    WNT5.DE = GetWntValue(groupKeyArray[14]);
                    WNT5.DEKey = groupKeyArray[14];
                    WNT5.ABC = GetWntValue(groupKeyArray[15]);
                    WNT5.ABCKey = groupKeyArray[15];
                    WNT5.ABD = GetWntValue(groupKeyArray[16]);
                    WNT5.ABDKey = groupKeyArray[16];
                    WNT5.ABE = GetWntValue(groupKeyArray[17]);
                    WNT5.ABEKey = groupKeyArray[17];
                    WNT5.ACD = GetWntValue(groupKeyArray[18]);
                    WNT5.ACDKey = groupKeyArray[18];
                    WNT5.ACE = GetWntValue(groupKeyArray[19]);
                    WNT5.ACEKey = groupKeyArray[19];
                    WNT5.ADE = GetWntValue(groupKeyArray[20]);
                    WNT5.ADEKey = groupKeyArray[20];
                    WNT5.BCD = GetWntValue(groupKeyArray[21]);
                    WNT5.BCDKey = groupKeyArray[21];
                    WNT5.BCE = GetWntValue(groupKeyArray[22]);
                    WNT5.BCEKey = groupKeyArray[22];
                    WNT5.BDE = GetWntValue(groupKeyArray[23]);
                    WNT5.BDEKey = groupKeyArray[23];
                    WNT5.CDE = GetWntValue(groupKeyArray[24]);
                    WNT5.CDEKey = groupKeyArray[24];
                    WNT5.ABCD = GetWntValue(groupKeyArray[25]);
                    WNT5.ABCDKey = groupKeyArray[25];
                    WNT5.ABCE = GetWntValue(groupKeyArray[26]);
                    WNT5.ABCEKey = groupKeyArray[26];
                    WNT5.ABDE = GetWntValue(groupKeyArray[27]);
                    WNT5.ABDEKey = groupKeyArray[27];
                    WNT5.ACDE = GetWntValue(groupKeyArray[28]);
                    WNT5.ACDEKey = groupKeyArray[28];
                    WNT5.BCDE = GetWntValue(groupKeyArray[29]);
                    WNT5.BCDEKey = groupKeyArray[29];
                    WNT5.ABCDE = GetWntValue(groupKeyArray[30]);
                    WNT5.ABCDEKey = groupKeyArray[30];
                    break;
            }
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

        path_OnClick = function (m) {
            var arr = m.split(":");
            var areaIndex = arr[0];
            var graphIndex = arr[1];
        };
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
