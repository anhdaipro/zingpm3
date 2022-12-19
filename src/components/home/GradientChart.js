
import axios from 'axios';
import React, {useState,useEffect,useCallback,useRef,memo, useMemo} from 'react'
import {dashboardURL,} from "../../urls"
import { Line } from 'react-chartjs-2';
import PropTypes, { objectOf } from 'prop-types';
import styled from "styled-components"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const listsum=Array(13).fill().map((_,i)=>('0'+i*6).slice(-2))
const listcount=Array(13).fill().map((_,i)=>('0'+i+6).slice(-2))
const Tooltipstyle=styled.div`
position:absolute;
&:before{
    content: '';
    top:100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);  
    border:10px solid transparent;
    border-top:10px solid ${props=>props.border}; 
}
`

const GradientChart = (props) => {
    const {labels,songs,top1,top2,top3,listvalues}=props
    const max=top1.length>0?Math.max.apply(Math, top1):5
    console.log(max)
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState(null);
    const [title,setTitle]=useState()
    const chartRef=useRef()
    const [index,setIndex]=useState()
    const [dataindex,setDataindex]=useState()
    
    const [background,setBackground]=useState()
    const scale=useMemo(()=>({
        x: {
            grid: {
                display:true, //value
                drawTicks: true,//tich x
                drawBorder: true,//tich x
                drawOnChartArea: false,//dường sọc dohc
            },
            ticks: {
                // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                callback: function(val, index) {
                // Hide every 6nd tick label
                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                },
                    color: 'rgba(255,255,255,0.2)',
                },
            },
        y:{
            beginAtZero: true,
            
            ticks:{
                stepSize: max/5,
                
                display:false //value
            },
            grid: {
                display:true,
                color:'rgba(255,255,255,0.1)',
                borderDashOffset:1,
                backdropColor:'rgba(255,255,255,0.1)',
                borderDash:[5,5],
                drawTicks:true,
                showLabelBackdrop:true,
                drawTicks: false,//tich value y
                drawBorder: true,//tich value y màu sọc fuction
                drawOnChartArea: true,//dường sọc ngang
            },
            title: {
                display: false,
                text: 'Value',
                color: '#191',
                font: {
                    family: 'Times',
                    size: 20,
                    style: 'normal',
                    lineHeight: 1.2
                },
            }
        }
    }),[max])
    const song=useMemo(()=>{
        if(index!==undefined){
        return songs[index]
        }
    },[songs,index])
    const chart=useMemo(()=>{return{
        labels:labels,
        datasets: [
        {
           
            data: top1,
            fill:false,
            borderWidth:2,
            stepped: false,
            pointHoverBorderWidth:5,
            pointRadius:index==0?4:0,
            pointHoverRadius:5,
            pointBorderWidth:2,
            borderJoinStyle:'round',
            tension: 0.4,
            pointHoverBackgroundColor:'#4a90e2',
            pointHoverBorderColor:'fff',
            hoverBorderWidth:3,
            pointHoverBorderWidth:2,
            borderColor:'#fff',
            backgroundColor: '#4a90e2',
            segment: {
                borderColor: '#4a90e2'
            },
        },
        {
            
            data: top2,
            fill:false,
            pointRadius:index==1?4:0,
            borderWidth:2,
            stepped: false,
            tension: 0.4,
            pointHoverBorderWidth:5,
            pointBorderWidth:2,
            hoverBorderWidth:3,
            pointHoverBackgroundColor:'#27bd9c',
            pointHoverBorderColor:'fff',
            pointHoverBorderWidth:2,
            pointHoverRadius:5,
            borderColor:'#fff',
            backgroundColor: '#27bd9c',
            segment: {
                borderColor: '#27bd9c'
            },
            
        },
        {
            
            data: top3,
            fill:false,
            borderWidth:2,
            stepped: false,
            pointHoverBorderWidth:5,
            pointRadius:index==2?4:0,
            pointHoverRadius:5,
            pointBorderWidth:2,
            borderJoinStyle:'round',
            tension: 0.4,
            pointHoverBackgroundColor:'#e35050',
            pointHoverBorderColor:'fff',
            hoverBorderWidth:3,
            pointHoverBorderWidth:2,
            borderColor:'#fff',
            backgroundColor: '#e35050',
            segment: {
                borderColor: '#e35050'
            },
        },
    ],
    }},[listsum,listcount,labels,index])

    const customTooltip = useCallback((context) => {
        if (context.tooltip.opacity == 0) {
          // hide tooltip visibilty
          setTooltipVisible(false);
          return;
        }
        const chart = chartRef.current;
        const canvas = chart.canvas;
        if (canvas) {
          // enable tooltip visibilty
          setTooltipVisible(true);
          // set position of tooltip
          const left = (context.tooltip.caretX);
          const top = context.tooltip.y-context.tooltip.height-10;
          // handle tooltip multiple rerender
          if (tooltipPos?.top != top) {
           
            setBackground(context.tooltip.labelColors[0].backgroundColor)
          }
        setTitle(context.tooltip.title)
        }
    },[tooltipPos,tooltipVisible,title]);
    
    const plugins=[{
        afterDraw: chart => {
          if (chart._active?.length) {
            
            
            let x = chart._active[0].element.x;
            let yAxis = chart.scales.y;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = chart._active[0].element.options.backgroundColor;
            ctx.stroke();
            ctx.restore();
          }
        }
      }]
    const options=useMemo(()=>{return{
        events: ['mousemove', 'click'],
        onHover: (event,activeEls, chartElement) => {
            if(chartElement._active.length>0){
                const left = (chartElement._active[0].element.x);
                const top = chartElement._active[0].element.y
                // handle tooltip multiple rerender
                if (tooltipPos?.top != top) {
                    setIndex(chartElement._active[0].datasetIndex)
                    setDataindex(chartElement._active[0].index)
                    setTooltipPos({ top: top, left: left });
                    setTooltipData(chartElement._active[0].element.raw);
                    setBackground(chartElement._active[0].element.options.backgroundColor)
                }
            }
            event.native.target.style.cursor = activeEls[0] ? 'pointer' : 'default';
            
            
        },
        
        hover: {
            mode: 'nearest',
            intersect: false
            },
        responsive: true,
            plugins:{
                
                legend: {
                display: false,
                
            },
            tooltip:{
                enabled:false,
               
                external: customTooltip,
            }                            
        },
        maintainAspectRatio: false,
        scales: scale}
    },[])
    
    return(
        <>
        <Line
            style={{position:'absolute',left:0,top:0}}
            ref={chartRef}
            options={options}
            plugins={plugins}
            data={chart}
        />
        {song && (
        <Tooltipstyle border={background} style={{transform:`translate(-50%,-100%)`,height:'46px',position: `absolute`, padding: `0px`, background: `${background}`, borderRadius: `4px`, 
            color: `rgb(255, 255, 255)`, display: `block`, pointerEvents: `none`, boxShadow: `rgba(0, 0, 0, 0.12) 0px 6px 16px 0px`,
             whiteSpace: `nowrap`, zIndex: 9, transition: `left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s`, 
             left: `${tooltipPos.left}px`, top: `${tooltipPos?tooltipPos.top-20:0}px`}}>
            <div style={{fontSize: `14px`, color: `#fff`}}>
                <div className="tool-tip item-space">
                    <div className="flex mr-8">
                        <div className="tool-tip-image" style={{backgroundImage:`url(${song.image_cover})`}}></div>
                        <div className="tool-tip-info">
                            <p className="tool-tip-info-name">{song.name}</p>
                            <p className="tool-tip-info-artist">{song.artist_name}</p>
                        </div>
                    </div>
                    <div className="tool-tip-data">{tooltipData}</div>
                </div>
            </div>
        </Tooltipstyle>)}
        </>
    )
}
GradientChart.prototype={
    songs:PropTypes.array,
    listvalues:PropTypes.array,
    labels:PropTypes.array,
    top1:PropTypes.array,
    top2:PropTypes.array,
    top3:PropTypes.array,
}
export default memo(GradientChart)