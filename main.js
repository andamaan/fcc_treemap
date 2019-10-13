import * as d3 from 'd3'

const svg = d3.select('svg')
const div = d3.select('div')

div.attr("id", "tooltip")
    .style("opacity", 0)


const width = +svg.attr('width')
const height = +svg.attr('height')
const margin = {top: 25,right: 25,bottom: 175,left: 25 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
const treeLayout = d3.tree().size([innerHeight, innerWidth])
const colors = {}

const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

const render = (data) => {

    const colorFunction = () => {
    let numberOfColors = data.children.length
    let hueStep = 200 / numberOfColors
    for(let i= 0; i< numberOfColors; i++){
        colors[data.children[i].name] = `hsl(${Math.round(i*hueStep + hueStep / 2)}, 100%, 75%)`
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
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("opacity", 1)
                    })
                    .on("mouseout", function(d) {
                        div.style("opacity", 0);
                        })
                    
    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${margin.left}, ${margin.top} )`)
        .selectAll('g')
        .data(data.children)   
            .enter()
                .append('g')
                    .append('rect')
                        .attr('class', 'legend-item')
                        .attr('width', 100)
                        .attr('height', 25)
                        .attr('x', (d,i) => i * 130)
                        .attr('fill', d => colors[d.name])
    }

d3.json('https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json')
  .then(data => {
        /*data.forEach(d => {
            d.year = +d.year
            //d.variance = +d.variance
        });*/
    render(data);
  })