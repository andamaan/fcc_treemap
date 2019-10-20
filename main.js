import * as d3 from 'd3'

const width = document.body.clientWidth - 50
const height = document.body.clientHeight - 150

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    
const div = d3.select('div')

div.attr("id", "tooltip")
    .style("opacity", 0)

const margin = {top: 25,right: 25,bottom: 100,left: 25 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
const treeLayout = d3.tree().size([innerHeight, innerWidth])
const colors = {}

const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

const render = (data) => {

    const colorFunction = () => {
    let numberOfColors = data.children.length
    let hueStep = 359 / numberOfColors
    for(let i= 0; i< numberOfColors; i++){
        colors[data.children[i].name] = `hsl(${Math.round(i*hueStep + hueStep / 2)}, 75%, 85%)`
    }
    }
    colorFunction()
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        
    const treemapLayout = d3.treemap()
        .size([innerWidth, innerHeight])

    treemapLayout(root)

    const tiles = svg.append('g')
        .attr('id', 'treemap')
        .attr('transform', `translate(${margin.left}, ${margin.top + 50})`)
        .selectAll('g')
        .data(root.leaves())
            .enter()
                .append('g')
                    .attr('transform', d => `translate(${d.x0},${d.y0})`)
    tiles
        .append('rect')
            .attr('class', 'tile')
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.value)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', d => colors[d.data.category])
            .attr('stroke', 'white')
        .on("mouseover", function(d) {
            div.attr('data-value', d.value)
            .html(d.data.name)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 20) + "px")
                .style("opacity", 1)
        })
        .on("mouseout", function(d) {
            div.style("opacity", 0);
            })
    tiles
        .append("foreignObject")
            .attr("width", (d) => d.x1 - d.x0 )
            .attr("height", 0.01 ) 
            .append("xhtml:div")
                .attr("class", "tile-label")
                .html( (d) => d.data.name )

                    
    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${margin.left}, ${margin.top} )`)
        .selectAll('g')
        .data(data.children)   
            .enter()
                .append('g')
    legend
        .append('rect')
            .attr('class', 'legend-item')
            .attr('width', 100)
            .attr('height', 25)
            .attr('x', (d,i) => i * 130)
            .attr('fill', d => colors[d.name])
    legend.append("text")
        .attr("class", "legend-label")
        .attr("x", (d, i) => 100 / 2 + i * 130 )
        .attr("y", 25 / 2 )
        .attr('width', 10)
        .attr('height', 10)

        .attr("text-anchor", "middle" )
        .attr("dominant-baseline", "central")
        .text( (d) => d.name )				

    }

d3.json('https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json')
  .then(data => {
        /*data.forEach(d => {
            d.year = +d.year
            //d.variance = +d.variance
        });*/
    render(data);
  })