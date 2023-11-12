const app = (a) => { console.log(a) }

function plusOne(newsession, reset, response) {
    if (/false/.test(newsession) && reset === 'false' && response) {

        let iscorrect = /true/.test(response)
        setTimeout(() => {

            $('<span class="plus-one"/>', {

                style: "display:none"
            })
                .css("color", `${iscorrect ? 'limegreen' : 'red'}`)
                .html(`+${iscorrect ? 1 : 0}`)
                .appendTo($('.container-grid '))
                .fadeIn('1000', () => {

                    let score = $("#score-head > h5 > strong")
                    var e = $('.plus-one')
                    setTimeout(() => {
                        console.log("timeout")
                        e.remove();
                    }, 2000)
                })

        }, 100)
    }

}

function checkevent() {

    let ev = window.performance.getEntriesByType("navigation")[0].type;
    if (ev === 'reload') {
        fetch("/reset")
            .then(res => {

                window.history.replaceState(null, null, window.location.href)

            })
    }
}

export { app, plusOne, checkevent }