window.addEventListener('DOMContentLoaded', () => {    
    setTimeout(() => {
        const table = document.querySelector('#tbody')
        const snDis = document.querySelector('#sn-display')
        const resPane = document.querySelector('#results')
        fetch('/request?command=leagueseason').then((response) => {
            response.json().then((data) => {
                snDis.textContent = data.season
                createSeasonSwitch(data.season, snDis)
                readTeam('read', table, data.season)
                readResult('readResult', resPane, data.season, data.day)
            })
        })      
    }, 500)
  
})

const readTeam = (command, table, sn) => {
    const url = `/request?command=${command}&sn=${sn}`
fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.length === 0) return alert('Table is blank')
            data.sort(dynamicSort('Pts', 'desc'))
            for(i=1; i<=data.length; i++) {
                addRows(table)                
              }
                for(let i=0; i<10; i++) {
                        addColumns(table, data.length, data)
              }
            
        })
    })
}

let addRows = (table) => {
    let row = table.insertRow(table.rows.length)
  }
  let positionIndicator = (table, i) => {
      switch (i) {
        case 0: case 1: case 2: case 3:
    table.rows[i].cells[0].classList.add('first-four')
    break;
        case 4: case 5:
    table.rows[i].cells[0].classList.add('five-six')
    break;
        case table.rows.length - 1: case table.rows.length - 2: case table.rows.length - 3: case table.rows.length - 4:
    table.rows[i].cells[0].classList.add('last-four')
    }
} 
  let addColumns = (table, rowCount, teams) => {
      let cellCount = table.rows[0].cells.length
      let cell = []
      for(i=0; i<rowCount; i++) {
      cell[cellCount] = table.rows[i].insertCell(cellCount) 
          switch ( cellCount ) {
            case 0:
                  cell[cellCount].textContent = i + 1
                  positionIndicator(table, i)
                  break;
            case 1:
                cell[cellCount].textContent = teams[i].team
                document.querySelector('#coronation-logo').setAttribute('src', `../img/${teams[0].team}.png`)
                break;
            case 2:
                cell[cellCount].textContent = teams[i].P
                break;
            case 3:
                cell[cellCount].textContent = teams[i].W
                break;
            case 4:
                cell[cellCount].textContent = teams[i].D
                break;
            case 5:
                cell[cellCount].textContent = teams[i].L
                break;
            case 6:
                cell[cellCount].textContent = teams[i].GF
                break;
            case 7:
                cell[cellCount].textContent = teams[i].GA
                break;
            case 8:
                cell[cellCount].textContent = teams[i].GD
                break;
            case 9:
                cell[cellCount].textContent = teams[i].Pts               
          }

      }
  }
let createSeasonSwitch = (season, snDis) => {
    let panel = document.querySelector('.switch-right')
    panel.addEventListener('click', (e) => {
        snDis.textContent = e.target.textContent
        let table = document.querySelector('#tbody')
        deleteTable(table)
        readTeam('read', table, e.target.textContent)
    })
    for (i = 0; i < season; i++) {
        let btn = document.createElement('button')
        btn.textContent = i + 1
        panel.append(btn)
    }
}
let deleteTable = (table) => {
    let lastRow = table.rows.length - 1
    for (i = lastRow; i >= 0; i--) {
        table.deleteRow(i)
    }
}
  let dynamicSort = (prop, order) => {
      let sortOrder = 1
      if (order === 'desc') {
        sortOrder = -1
      }
      return function (a, b) {
        //   a should come before b in the sorted order
        if (a[prop] < b[prop]) {
            return -1 * sortOrder
            // a should come after b in sorted order
        } else if (a[prop] > b[prop]) {
            return 1 * sortOrder
            // a and b are the same 
        } else {
            return 0 * sortOrder
        }
      }
  }

 