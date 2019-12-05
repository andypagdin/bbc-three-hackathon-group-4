import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Modal from './modal';
import 'bootstrap/dist/css/bootstrap.min.css'
import './map.css'

am4core.useTheme(am4themes_animated);

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = { showMoadel: false, selectedRegion: null }
    this.handleClick = this.handleClick.bind(this);
    this.hideModal = this.hideModal.bind(this)
  }

  handleClick(selectedRegion) {
    this.setState({ showMoadel: true, selectedRegion: selectedRegion });
  }

  hideModal () {
    this.setState({ showMoadel: false });
  }

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/ukHigh.json";
    chart.geodataSource.events.on("parseended", function (ev) {
      let data = [];
      for (var i = 0; i < ev.target.data.features.length; i++) {


        var regions = {};

        regions["South East England"] = 11;
        regions["South West England"] = 0;
        regions["Greater London"] = 0;
        regions["East of England"] = 0;
        regions["East Midlands"] = 0;
        regions["West Midlands"] = 0;
        regions["Wales"] = 0;
        regions["North West Engalnd"] = 0;
        regions["Yorkshire and the Humber"] = 0;
        regions["North West England"] = 0;
        regions["Scotland"] = 0;
        regions["Northern Ireland"] = 0;
        regions["Ireland"] = 0;

        let value = 0;

        if(ev.target.data.features[i].properties.name == "South East England"){
          value = 11;  
        } 

        console.log(ev.target.data.features[i].properties.name)


        data.push({
          id: ev.target.data.features[i].id,
          value: value
        })
      }
      polygonSeries.data = data;
    })

    chart.projection = new am4maps.projections.Mercator();

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3)
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series tooltip
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    const cb = (ev) => {
      this.handleClick(ev.target.dataItem.dataContext.name);
    }

    polygonTemplate.events.on("hit", cb);

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000000;
    heatLegend.valign = "bottom";

    // Set up custom heat map legend labels using axis ranges
    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "Unpoplar";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "Popular";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
      return "";
    });


  // Set up heat legend
  let heatLegend = chart.createChild(am4maps.HeatLegend);
  heatLegend.series = polygonSeries;
  heatLegend.align = "right";
  heatLegend.width = am4core.percent(25);
  heatLegend.marginRight = am4core.percent(4);
  heatLegend.minValue = 0;
  heatLegend.maxValue = 40000000;
  heatLegend.valign = "bottom";

  // Set up custom heat map legend labels using axis ranges
  var minRange = heatLegend.valueAxis.axisRanges.create();
  minRange.value = heatLegend.minValue;
  minRange.label.text = "Least Viewed";
  var maxRange = heatLegend.valueAxis.axisRanges.create();
  maxRange.value = heatLegend.maxValue;
  maxRange.label.text = "Most Viewed";

  // Blank out internal heat legend value axis labels
  heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
    return "";
  });


  
    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div>
        <div id="chartdiv"></div>
        <Modal selectedRegion={this.state.selectedRegion} show={this.state.showMoadel} hide={this.hideModal} />
      </div>
    );
  }
}

export default Map;