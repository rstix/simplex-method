
let simplexTable = [[3,1,1,1,0,0,10,0],[4,3,1,0,1,0,15,0],[5,-1,1,0,0,1,13,0],[0,-3,1,0,0,0,0]]
// let simplexTable = [[5,8,-2,1,-1,1,0,0,50,0],[6,3,5,0,2,0,1,0,150,0],[7,1,-1,2,-4,0,0,1,130,0],[0,2,4,-4,7,0,0,0,0]]



const table = document.querySelector('#table')

const nextStep = document.querySelector('.next-step')

const tableLength = simplexTable[0].length

let pivot = {
  row: null,
  column: null,
  value: null
}

// console.log(simplexTable[1][0])

const indexOfNegative = (arr) => {
  return arr.slice(0, -1).findIndex(e => e < 0)
}


const createRatios = (column) => {
  if(column == -1) return 1
  
  simplexTable.forEach((el,index) => {
    if(index < simplexTable.length-1){
      el[tableLength-1] = el[tableLength-2] / el[column]
    }
  })
  
}

const selectSmallest = () => {
  return simplexTable.reduce((acc, current, index) => {
    if(acc.value >= current[tableLength-1] && current[tableLength-1] >= 0){
      acc.value = current[tableLength-1]
      acc.index = index
    }
    return acc
    
  },{value : Infinity, index : 0});
}

const updatePivotIndex = (pivot) => {
  pivot.column = indexOfNegative(simplexTable[simplexTable.length - 1])
  pivot.row = selectSmallest().index
  pivot.value = simplexTable[pivot.row][pivot.column]
  return pivot
}

const switchBasics = (updatedPivotIndex) => {
  simplexTable[updatedPivotIndex.row][0] = updatedPivotIndex.column
}

const createTableFirstRow = () => {
  const numbers = [...Array(tableLength - 2).keys()];
  const rowDiv = `
  <div class="row header"> 
    ${numbers.map(n => {
      return `
      <span>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
        <msub>
          <mi>x</mi>
          <mi>${n}</mi>
        </msub>
      </math>
     </span>
      `
    }).join('')}
  </div>
  `

  return rowDiv
}

// ${ i == pivot.row && j == pivot.column ? 'pivott' : ''}

const renderInHTMLTable = (simplexTable,step) => {
  const html = simplexTable.map((el,i) => {
    return `
      <div class="row">
      ${el.map((n,j) => {
        if(j==n)console.log(j,n)
        return `<span class=
          ${ i == simplexTable.length-1 && j == pivot.column && step == 'find-column' ? 'pivot-column' : ''}
          ${ i == pivot.row && j == pivot.column && step == 'find-pivot' ? 'pivot' : ''}
          ${ i == pivot.row && step == 'find-pivot' ? 'pivot-row-whole' : ''}
          ${ j == pivot.column && (step == 'create-ratios' || step =='select-smallest' || step =='find-pivot') ? 'pivot-column-whole' : ''}
          ${ i == pivot.row && j == tableLength-1 && step == 'select-smallest' ? 'pivot-row' : ''}
          ${ i == pivot.row && j == 0 && step == 'switch-basics' ? 'new-basic' : ''}
          ${ i == pivot.row && j > 0 && j < tableLength-1 && step == 'update-pivot-row' ? 'updated-row' : ''}
          ${ (j == 0 || j == tableLength-2) && i < simplexTable.length-1 && n < tableLength - simplexTable.length - 2 && step == 'results' ? 'result' : ''}
          > 
          ${Math.round(n * 100) / 100} </span>`
      }).join('')}
      </div>
    `
  }).join('');

  const div = document.createElement('div')
  div.innerHTML = createTableFirstRow() + html
  
  table.appendChild(div);
  // .innerHTML = createTableFirstRow() + html;
}

renderInHTMLTable(simplexTable)

const makePivotOne = () => {
  if(pivot.value ==  1) return
  simplexTable[pivot.row].forEach((el,index) => {
    if(index >0 && index < tableLength-1){
      simplexTable[pivot.row][index] = el / pivot.value
    }
  })
}

const performGauss = () => {
  simplexTable.forEach((r,ri) => {
    if(ri != pivot.row && r[pivot.column] != 0 ){
      const q = -r[pivot.column]
      r.forEach((el,eli) => {
        if(eli > 0 && eli < tableLength-1){
          simplexTable[ri][eli] = simplexTable[ri][eli] + q*simplexTable[pivot.row][eli]
        }
      })
    }
  })
  
}

const getResult = () =>{
  const resArr = new Array(tableLength - 3).fill(0);
  console.log(resArr)
    simplexTable.forEach((r,ri) => {
      resArr[r[0]-1] = simplexTable[ri][tableLength-2]
    })
  
  document.querySelector('#result').innerHTML = `
    Minimun ${-simplexTable[simplexTable.length-1][tableLength-2]} occurs at  (${resArr.slice(0,tableLength - simplexTable.length - 2)})
  `;
}

// document.querySelector('#result').innerHTML = `<math xmlns="http://www.w3.org/1998/Math/MathML">
//       <msub>
//         <mi>x</mi>
//         <mi>1</mi>
//       </msub>
//     </math>`


// for (i = 0; i < 3; i++) {
//   createRatios()
//   switchBasics(updatePivotIndex(pivot))
//   makePivotOne()
//   performGauss()
// }

const startAlgorithm = () => {  
  let counter = 0
  // setTimeout(function() {
    while(indexOfNegative(simplexTable[simplexTable.length - 1]) != -1 && counter < 50){
      
        createRatios()
        switchBasics(updatePivotIndex(pivot))
        makePivotOne()
        performGauss()
        renderInHTMLTable(simplexTable)
      
      counter++
    }
    getResult()
  // }, 2000);
  
  
  // renderInHTMLTable(simplexTable)
 
}

if(indexOfNegative(simplexTable[simplexTable.length - 1]) != -1){
  nextStep.innerHTML = 'find column'
  nextStep.dataset.step = 'find-column'

  // let step = nextStep.dataset.step

  nextStep.addEventListener('click',() => {
    const step = nextStep.dataset.step
    
    // const column = indexOfNegative(simplexTable[simplexTable.length - 1])
    switch(step){
      case 'find-column':
        const column = indexOfNegative(simplexTable[simplexTable.length - 1])
        if(column == -1){
          renderInHTMLTable(simplexTable,'results')
          getResult()
          nextStep.disabled = true
          break;
        }
        pivot.column =  column
        console.log(pivot)
        renderInHTMLTable(simplexTable,'find-column')
        nextStep.dataset.step = 'create-ratios'
        nextStep.innerHTML = 'create ratios'
        break;
      case 'create-ratios':
        console.log(pivot)
        createRatios(indexOfNegative(simplexTable[simplexTable.length - 1]))
        renderInHTMLTable(simplexTable,'create-ratios')
        nextStep.dataset.step = 'select-smallest'
        nextStep.innerHTML = 'select smallest'
        break;
      case 'select-smallest':
        console.log(selectSmallest())
        pivot.row = selectSmallest().index
        renderInHTMLTable(simplexTable,'select-smallest')
        nextStep.dataset.step = 'find-pivot'
        nextStep.innerHTML = 'find pivot'
        break;
      case 'find-pivot':
        updatePivotIndex(pivot)
        renderInHTMLTable(simplexTable,'find-pivot')
        nextStep.dataset.step = 'switch-basics'
        nextStep.innerHTML = 'switch basics'
        break;
      case 'switch-basics':
        switchBasics(updatePivotIndex(pivot))
        renderInHTMLTable(simplexTable,'switch-basics')
        nextStep.dataset.step = 'update-pivot-row'
        nextStep.innerHTML = 'update pivot row'
        break;
      case 'update-pivot-row':
        makePivotOne()
        renderInHTMLTable(simplexTable,'update-pivot-row')
        nextStep.dataset.step = 'perform-gauss'
        nextStep.innerHTML = 'perform gauss'
        break;
      case 'perform-gauss':
        performGauss()
        renderInHTMLTable(simplexTable)
        nextStep.dataset.step = 'find-column'
        nextStep.innerHTML = 'find column'
        break;
    }

    window.scrollTo(0,document.body.scrollHeight);
  })

}else{
  nextStep.classList.add('hide')
}

// startAlgorithm()

const startButton = document.querySelector('button')

startButton.addEventListener('click',startAlgorithm)
