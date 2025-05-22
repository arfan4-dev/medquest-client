import ReactApexChart from "react-apexcharts";

const GaugeChart = ({ heading, series }) => {
  
   const getColor = (value) => {
     const numValue = parseFloat(value[0]);

     if (numValue >= 70) {
       return "#32CD32";
     } else if (numValue >= 40 && numValue < 70) {
       return "#CCD000";
     } else {
       return "#FF0000";
     }
   };

   const chartColor = getColor(series);
   const options = {
     chart: {
       type: "radialBar",
       offsetY: -20,
     },
     plotOptions: {
       radialBar: {
         startAngle: 0,
         endAngle: 360,
         track: {
           background: "#E7E7E7",
           strokeWidth: "100%",
           margin: 20,
         },
         dataLabels: {
           name: {
             show: false,
           },
           value: {
             offsetY: 15,
             fontSize: "46px",
             fontWeight: "600",
             color: "#343A40",
             formatter: function (val) {
               return val + "﹪";
             },
           },
         },
       },
     },
     fill: {
       colors: [chartColor],
     },
     labels: ["Average Results"],
   };

   return (
     <div>
       <h2>{heading}</h2>
       <ReactApexChart
         key={chartColor}
         options={options}
         height={400}
         series={series}
         type="radialBar"
       />
     </div>
   );
};

export default GaugeChart;
