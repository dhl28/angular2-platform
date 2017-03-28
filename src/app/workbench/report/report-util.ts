/**
 * Created by dhl on 2016/11/22.
 */
import Util from '../../common/util';
declare var $: any;
var echarts = require("echarts");
require('echarts-wordcloud');
var d3 = require("d3");
require('d3.svg.multibrush');
require('d3.parcoords');
var recodPk;
var renders = function (metaData, recorePk) {
  recodPk = recorePk;
  //init layout
  initLayout(metaData['div']);
  //render widgets
  initWidgets(metaData);

  //deal over event
  $('.closeicon').remove();
  $('.gutterBJ').remove();
  //dealTableOver();
  dealTextOver();
}
function initLayout(divStr) {
  var $container = $('.report');
  var height =  $(window).height();
  let divs = JSON.parse(divStr);

  divs.map(div=>{
    var $canvas = $('<div class="canvas"></div>');
    $canvas.css('height',height);
    $canvas.append(div.replace(/\-moz-calc/g,"calc"));
    $container.append($canvas);
  });
}

function initWidgets(metaData) {
  let domMap: any[] = JSON.parse(metaData.domMap);
  domMap.map(d=>initWidgetsByType(d, metaData));
}

function initWidgetsByType(domMap, metaData) {
  for (let k in domMap) {
    switch (k) {
      case 'tbas':
        drawAllCharts(domMap[k]);
        break;
      case 'bgs':
        drawBgs(domMap[k]);
        break;
      case 'tps':
        drawTps(domMap[k]);
        break;
      case 'wzs':
    }
  }
  //获取控件数据
  function getDataByDomPk(domPk) {
    return metaData['data'][domPk];
  }
function drawTps(tpss){
  console.log(tpss);
  tpss.map(t=> {
    let id = t.domid;
    let dompk = t.dompk;
    let path = '';
    path = Util.PROD_CTX + "/api/loadPicWithRecordPk/?path=" + dompk + "&recordPk=" + recodPk;
    var $img = $('<img/>', {
      src: path
    });
    $('#' + id).html($img);
    $('#' + id + ' img').addClass('addedDivSize');
  })
}
  //绘制表格
  function drawBgs(tables) {
    tables.map(t=> {
      let id = t.domid;
      let dompk = t.dompk;
      drawSingleTable(id, getDataByDomPk(dompk));
    })
  }

  //绘制图表
  function drawAllCharts(items) {
    items.map(t=> {
      let id = t.domid;
      let dompk = t.dompk;
      let chart = getDataByDomPk(dompk);
      if(chart.option !== null){
        let opts = chart.option.replace(/\'/g, '"');
        let jsonOpt = (new Function("", "return " + opts))();
        let theme = chart.theme ? chart.theme : 'infographic';
        let d3Title = chart.parallelTitle ? chart.parallelTitle : '';
        let d3Color = chart.parallelBgColor;
        switch (chart.type) {
          case 'echart':
            drawCharts(id, jsonOpt,theme);
            break;
          case 'd3-Parallel':
            drawZBZ(id, jsonOpt,theme,d3Title,d3Color);
            break;
          case 'd3-Heat':
            drawCharts(id, jsonOpt,theme);
            break;
        }
      }else{
        console.log('节点数据为空！请重新运行');
        //Util.createMsg('节点数据为空！请重新运行', 'info');
      }
    })
  }

}
function drawSingleTable(domId, jsonOpt) {
  if (!jsonOpt) return;
  var addTable = '<table><thead><tr>';
  if (jsonOpt.thead.length !== 0) {
    for (var i = 0; i < jsonOpt.thead.length; i++) {
      addTable = addTable + '<th>' + jsonOpt.thead[i] + '</th>';
    }
    addTable = addTable + '</tr></thead>'
  }
  if (jsonOpt.tdata.length !== 0) {
    let max = 100;//TODO 性能问题：暂时渲染100条
    addTable = addTable + '<tbody>'
    for (var j = 0; j < jsonOpt.tdata.length && j < max; j++) {
      addTable = addTable + '<tr>';
      for (var k = 0; k < jsonOpt.tdata[j].length; k++) {
        addTable = addTable + '<td>' + jsonOpt.tdata[j][k] + '</td>';
      }
      addTable = addTable + '</tr>';
    }
    addTable = addTable + '</tbody></table>'
  }
  $('#' + domId).css({overflow: 'hidden'});
  $('#' + domId).html(addTable);
  $('#' + domId + ' table').addClass('addedDivSize table');
  dealTableOver(domId);
}
//echart加载方式
var drawCharts = function (id, opt,theme) {
  var dom = $("#" + id).get(0);
  //echart2中的force图在3中归类为graph，故需添加适配
  if(opt.series[0].type === 'force'){
    opt.series[0].type = 'graph';
    opt.series[0].layout = 'force';
    var wid = $("#" + id).width();
    var hit = $("#" + id).height();
    var len = opt.series[0].links.length;
    opt.series[0].force = {
      gravity:0.1,
      repulsion:wid > hit ? hit : wid,
      layoutAnimation:false
    };
    // opt.series[0].height = '100%';
    // opt.series[0].width = '100%';
    for(var i = 0;i < len;i++){
      opt.series[0].links[i].value = opt.series[0].links[i].weight;
      delete opt.series[0].links[i].weight;
    }
    var nodesLen = opt.series[0].nodes.length;
    for(var j = 0;j < nodesLen;j++){
      opt.series[0].nodes[j].symbolSize = getSymbolSize();
    }
  }
  var myChart = echarts.init(dom,theme);
  myChart.setOption(opt);
};
function getSymbolSize()
{
  var Range = 50;
  var Rand = Math.random();
  return(20 + Math.round(Rand * Range));
}
function  dealTableOver(domId) {
  $('#' + domId + ' table').parent().hover(
    function(e){
      $(this).css({overflow: 'auto'});
    },
    function(){
      $(this).css({overflow: 'hidden'});
    }
  );
}
//d3 平行坐标轴加载
function drawZBZ(id, opt,theme,d3Title,d3Color) {
  var dom = $('#' + id).get(0);
  $('#' + id).empty();
  $('#' + id).addClass('parcoords');
  $('#' + dom.id).css('background',d3Color);
  $('#' + dom.id).addClass( theme + 'parcoords');
  $('#' + dom.id).append('<h3 class="d3title">' + d3Title + '</h3>');
  var mheight = $('#' + dom.id)[0].offsetHeight - 20;
  var mwidth = $('#' + id)[0].offsetWidth; //宽度
  d3.parcoords(theme)("#" + id)
    .height(mheight)
    .width(mwidth)
    .data(opt)
    .showControlPoints(false)
    .render()
    .axisDots()
    .brushMode("1D-axes")
    .interactive();
}
function dealTextOver() {
  $(".textDiv").hover(function(){
    $(this).css({overflow: 'auto'});
  },function(){
    $(this).css({overflow: 'hidden'});
  })
}
export default {renders}
