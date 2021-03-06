window.addEventListener('DOMContentLoaded', () => {    
        const table = document.querySelectorAll('.gbody')
        const snDis = document.querySelector('#scl-id')
        fetch('/metadata').then((response) => {
            response.json().then((data) => {
                snDis.textContent = data.scl.season
                createSeasonSwitch(data.scl.season, snDis)
                readGroups(table, data.scl.season)
            })
        }) 

const homeDraw = document.querySelectorAll('.home-draw')
const awayDraw = document.querySelectorAll('.away-draw')
const flHS = document.querySelectorAll('.fl-home-score')
const flAS = document.querySelectorAll('.fl-away-score')
const slHS = document.querySelectorAll('.sl-home-score')
const slAS = document.querySelectorAll('.sl-away-score')
const finHS = document.querySelectorAll('.fin-home-score')
const finAS = document.querySelectorAll('.fin-away-score')
const readGroups = (table, sn) => {
    document.querySelector('.sn-avail-info').textContent = ''
    const groups = ['A', 'B', 'C', 'D']
    for (i=0; i<4; i++) {
        const body = table[i]
        const g = groups[i]
        const url = `/scl/fetch/group?sn=${sn}&g=${g}`
fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.feedBack) {
                document.querySelector('.sn-avail-info').textContent = data.feedBack
                distribute(body, 0, 0)
                return 0
            } 
            data.sort(dynamicSort('Pts', 'GD'))
                for(let i=0; i<10; i++) {
                        distribute(body, data.length, data)
              }       
        })
    })
    }
    readKO(sn)
}
const readKO = (sn) => {
    document.querySelector('.sn-avail-info').textContent = ''
    const url = `/scl/fetch/ko?sn=${sn}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.feedBack) return document.querySelector('.sn-avail-info').textContent = data.feedBack
            draw(data)          
        })
    })
}
const draw = (data) => {
    for (i=0; i<data.length; i++) {
        homeDraw[i].textContent = data[i].firstLeg.home
        awayDraw[i].textContent = data[i].firstLeg.away
        if (data[i].firstLeg.played) {
            if (data[i].qualified === data[i].firstLeg.home) {
                homeDraw[i].style.fontWeight = '600'
                homeDraw[i].style.color = 'green'
            } else {
                awayDraw[i].style.fontWeight = '600'
                awayDraw[i].style.color = 'green'
            }
        }
        flHS[i].textContent = data[i].firstLeg.hs
        flAS[i].textContent = data[i].firstLeg.as
        if (i < 6) {
        slHS[i].textContent = data[i].secondLeg.hs
        slAS[i].textContent = data[i].secondLeg.as
        finHS[i].textContent = parseInt(data[i].firstLeg.hs) + parseInt(data[i].secondLeg.as )
        finAS[i].textContent = parseInt(data[i].firstLeg.as) + parseInt(data[i].secondLeg.hs)
        }
        if (i === 6) {
        document.querySelector('.coronation-body').innerHTML = `<img src='team/logo/${data[6].qualified}'>`
        }
    }
}
  let distribute = (table, rowCount, teams) => {
      if (rowCount === 0) {
          for (i=0; i<4; i++) {
            table.rows[i].cells[1].innerHTML = ''
            table.rows[i].cells[2].textContent = ''
            table.rows[i].cells[3].textContent = ''
            table.rows[i].cells[4].textContent = ''
            table.rows[i].cells[5].textContent = ''
            table.rows[i].cells[6].textContent = ''
            table.rows[i].cells[7].textContent = ''
            table.rows[i].cells[8].textContent = ''
            table.rows[i].cells[9].textContent = ''
          }        
      } else {
        for(i=0; i<rowCount; i++) {
            table.rows[i].cells[1].innerHTML = `<img class='logo-thumb' src='/team/logo/${teams[i].team}'> <span> ${teams[i].team} </span>`
            table.rows[i].cells[2].textContent = teams[i].P
            table.rows[i].cells[3].textContent = teams[i].W
            table.rows[i].cells[4].textContent = teams[i].D
            table.rows[i].cells[5].textContent = teams[i].L
            table.rows[i].cells[6].textContent = teams[i].GF
            table.rows[i].cells[7].textContent = teams[i].GA
            table.rows[i].cells[8].textContent = teams[i].GD
            table.rows[i].cells[9].textContent = teams[i].Pts               
    }
      }
      
  }
let createSeasonSwitch = (season, snDis) => {
    let panel = document.querySelector('.switch-right')
    panel.addEventListener('click', (e) => {
        wipeKO()
        snDis.textContent = e.target.textContent
        const table = document.querySelectorAll('.gbody')
        readGroups(table, (e.target.textContent - 0))
    })
    for (i = 0; i < season; i++) {
        let btn = document.createElement('button')
        btn.textContent = i + 1
        panel.append(btn)
        panel.scrollLeft = btn.clientWidth * (i - 1)
    }
}
let wipeKO = () => {
    let num = homeDraw.length
    for (i=0; i<num; i++) {
        homeDraw[i].textContent = '?'
        awayDraw[i].textContent = '?'
        homeDraw[i].style.color = ''
        awayDraw[i].style.color = ''
        homeDraw[i].style.fontWeight = ''
        awayDraw[i].style.fontWeight = ''
        flHS[i].textContent = 0
        flAS[i].textContent = 0
        if ( i < 6 ) {
            slHS[i].textContent = 0
            slAS[i].textContent = 0
            finHS[i].textContent = 0
            finAS[i].textContent = 0
        }
        
    }
    document.querySelector('.coronation-body').innerHTML = `<img src='team/logo/supreme'>`
}
let dynamicSort = (prop, tieBreaker) => {
    const sortOrder = -1
    return function (a, b) {
        //   a should come before b in the sorted order
        if (a[prop] < b[prop]) return -1 * sortOrder
        // a should come after b in sorted order
            else if (a[prop] > b[prop]) return 1 * sortOrder
            // a and b are the same, compare by the tieBreaker value
                if (a[tieBreaker] < b[tieBreaker]) return -1 * sortOrder
                    else if (a[tieBreaker] > b[tieBreaker]) return 1 * sortOrder 
                        return 0 * sortOrder
    }
}
})