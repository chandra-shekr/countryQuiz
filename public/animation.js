const app = (a) => { console.log(a) }

function plusOne(iscorrect) {

    setTimeout(() => {

        $('<span class="plus-one"/>', {

            style: "display:none"
        })
            .css("color", `${iscorrect ? 'limegreen' : 'red'}`)
            .html(iscorrect ? '+1' : '+0')
            .appendTo($('.container-grid '))
            .fadeIn('1000', () => {

                var e = $('.plus-one')
                setTimeout(() => {
                    console.log("timeout")
                    e.remove();
                }, 2000)
            })

    }, 500)



}
export { app, plusOne }