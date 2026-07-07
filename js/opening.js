const line1 = document.querySelector(".line-1");
const line2 = document.querySelector(".line-2");
const name = document.querySelector(".name");
const click = document.querySelector(".click-anywhere");
const opening = document.querySelector(".opening");

// Fungsi mengetik
function typeText(element, text, speed = 60) {
    return new Promise(resolve => {

        let i = 0;

        function type() {

            if (i < text.length) {

                element.textContent += text.charAt(i);

                i++;

                setTimeout(type, speed);

            } else {

                resolve();

            }

        }

        element.style.opacity = 1;

        type();

    });
}

async function intro() {

    await typeText(line1, "Untuk seseorang...");
    await new Promise(r => setTimeout(r, 700));

    await typeText(line2, "yang sangat spesial.");
    await new Promise(r => setTimeout(r, 1000));

    gsap.to(name, {

        opacity:1,

        duration:1,

        onStart(){

            name.textContent="Mazyyatul ❤";

        }

    });

    gsap.to(click,{

        opacity:1,

        delay:1

    });

}

intro();

// Klik di mana saja
window.addEventListener("click",()=>{

    gsap.to(opening,{

        opacity:0,

        duration:1,

        onComplete(){

            opening.remove();

        }

    });

},{once:true});