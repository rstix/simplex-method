
// let simplexTable = [[3,1,1,1,0,0,10,0],[4,3,1,0,1,0,15,0],[5,-1,1,0,0,1,13],[0,-3,1,0,0,0,0]]



let simplexTable = [[5,8,-2,1,-1,1,0,0,50,0],[6,3,5,0,2,0,1,0,150,0],[7,1,-1,2,-4,0,0,1,130,0],[0,2,4,-4,7,0,0,0,0]]

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


const createRatios = () => {
  const column = indexOfNegative(simplexTable[simplexTable.length - 1])
  console.log(column)
  
  if(column == -1) return 1
  
  simplexTable.forEach((el,index) => {
    // console.log(el,index)
    if(index < simplexTable.length-1){
      // console.log(el)
      el[tableLength-1] = el[tableLength-2] / el[column]
    }
  })
  
  // console.log(simplexTable)
  
}

const selectSmallest = () => {
  return simplexTable.reduce((acc, current, index) => {
    // console.log(current[tableLength-1])
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
  // console.log(simplexTable)
}


const renderInHTMLTable = (simplexTable) => {
  const html = simplexTable.map(el => {
    return `
      <div>
      ${el.map(n => {
        return `<span> ${Math.round(n * 100) / 100} </span>`
      })}
      </div>
    `
  }).join('');
  
  document.querySelector('#table').innerHTML = html;
}

const makePivotOne = () => {
  simplexTable[pivot.row].forEach((el,index) => {
    if(index >0){
      simplexTable[pivot.row][index] = el / pivot.value
    }
  })
}

const performGauss = () => {
  simplexTable.forEach((r,ri) => {
    if(ri != pivot.row && r[pivot.column] != 0 ){
      const q = -r[pivot.column]
      r.forEach((el,eli) => {
        if(eli > 0){
          simplexTable[ri][eli] = simplexTable[ri][eli] + q*simplexTable[pivot.row][eli]
        }
      })
    }
  })
  
}

const getResult = () =>{
  
  const resArr = new Array(tableLength - 3).fill(0);
  console.log(resArr)
  // resArr.forEach((el,eli) => {
    simplexTable.forEach((r,ri) => {
      // if(eli == r[0]-1){
        resArr[r[0]-1] = simplexTable[ri][tableLength-2]
      // }
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
  
  while(indexOfNegative(simplexTable[simplexTable.length - 1]) != -1 && counter < 50){
    createRatios()
    switchBasics(updatePivotIndex(pivot))
    makePivotOne()
    performGauss()
    counter++
  }
  
  renderInHTMLTable(simplexTable)
  getResult()
}

const startButton = document.querySelector('button')

startButton.addEventListener('click',startAlgorithm)
