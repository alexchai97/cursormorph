document.documentElement.style.scrollBehavior = "auto";

const lenis = new Lenis()
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute('href'));
    });
});

lenis.on('scroll', (e) => {
    updateScroll()
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


if (window.matchMedia("(pointer: coarse)").matches) {
    alert('Please use a desktop / laptop for the best experience!');
}

const scrolltrack = document.getElementById('scroll-track');
const scrollthumb = document.getElementById('scroll-thumb');

let HViewport, HPage, HScrollthumb, MaxScroll, CurrScroll, thumbPos;

function updateInfo() {
    HViewport = parseInt(window.getComputedStyle(scrolltrack).getPropertyValue('height'));
    HPage = parseInt(lenis.dimensions.scrollHeight);
    HScrollthumb = parseInt(HViewport / HPage * HViewport);

    MaxScroll = HPage - HViewport;
    CurrScroll = parseInt(lenis.actualScroll);

    thumbPos = CurrScroll / MaxScroll * (HViewport - HScrollthumb);
}

updateScroll()
function updateScroll() {
    updateInfo();
    scrollthumb.style.height = `${HScrollthumb}px`;
    scrollthumb.style.top = `${thumbPos}px`;
}

addEventListener("resize", (event) => {
    updateScroll();
});

scrolltrack.addEventListener('click', (event) => {
    scrollOnClick(parseInt(event.clientY));
    updateScroll();
});

function scrollOnClick(clickY) {

    updateScroll();

    var scrollPercent = (clickY - (HScrollthumb * .5)) / (HViewport - HScrollthumb)
    var ScrollPos = scrollPercent * MaxScroll;

    lenis.scrollTo(ScrollPos);
}

function trackCursor(event) {
    var HTrack = parseInt(window.getComputedStyle(scrolltrack).getPropertyValue('height'));

    var cursorY = parseInt(event.clientY);
    var cursorY = cursorY < 0 ? 0 : cursorY > HTrack ? HTrack : cursorY;

    cursor.classList.add('hide');

    scrollOnClick(cursorY)
}

let initialY;

scrollthumb.addEventListener('mousedown', (event) => {
    initialY = event.clientY;
    document.addEventListener('mousemove', trackCursor);

    event.preventDefault();
});

scrollthumb.addEventListener('mouseover', (event) => {
    cursor.classList.add('hide');
});

scrollthumb.addEventListener('mouseleave', (event) => {
    cursor.classList.remove('hide');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('hide');
    document.removeEventListener('mousemove', trackCursor);
});

let currPosition;
const cursor = document.getElementById('cursor');
let cursorWidth = parseInt(window.getComputedStyle(cursor).getPropertyValue('width'));
let cursorHeight = parseInt(window.getComputedStyle(cursor).getPropertyValue('height'));

function updateCursorPosition() {
    var lastPosition = {};
    lastPosition.x = parseInt(cursor.style.left);
    lastPosition.y = parseInt(cursor.style.top);

    if (ifMimic) {
        cursor.style.top = `${mimicY}px`;
        cursor.style.left = `${mimicX}px`;
    } else {
        if (currPosition) {
            cursorWidth = parseInt(window.getComputedStyle(cursor).getPropertyValue('width'));
            cursorHeight = parseInt(window.getComputedStyle(cursor).getPropertyValue('height'));
            cursor.style.top = `${currPosition.y - .5 * cursorHeight}px`;
            cursor.style.left = `${currPosition.x - .5 * cursorWidth}px`;
        }
    }

    // Request next update
    requestAnimationFrame(updateCursorPosition);
}

document.addEventListener('mousemove', (event) => {
    currPosition = { x: parseInt(event.clientX), y: parseInt(event.clientY) };
});

document.addEventListener('mousemove', () => requestAnimationFrame(updateCursorPosition));


document.addEventListener('mousedown', (event) => {
    cursor.classList.add('mousedown');
});

document.addEventListener('mouseup', (event) => {
    cursor.classList.remove('mousedown');
});

document.addEventListener('mouseleave', (event) => {
    cursor.classList.add('hide');
});

document.addEventListener('mouseenter', (event) => {
    cursor.classList.remove('hide');
});

scrollthumb.addEventListener('mouseleave', (event) => {
    cursor.classList.remove('hide');
});

$('h1, h2, h3, h4, h5, h6, p, input, textarea').on('mouseover', function () {
    $(cursor).addClass('text');
});

$('h1, h2, h3, h4, h5, h6, p, input, textarea').on('mouseleave', function () {
    $(cursor).removeClass('text');
});

let ifMimic = false;
let mimicX, mimicY;

$('a, .btn, .navbar-toggler, button, .highlight').on('mouseover', function () {
    ifMimic = true;

    var element = $(this);
    var width = element.outerWidth();
    var height = element.outerHeight();
    var borderRadius = element.css('border-radius');
    var position = element.offset();

    mimicX = position.left;
    mimicY = position.top - lenis.targetScroll;

    // Set custom variables in the style attribute
    cursor.style.setProperty('--element-width', `${width}px`);
    cursor.style.setProperty('--element-height', `${height}px`);
    cursor.style.setProperty('--element-border-radius', `${Math.max(parseInt(borderRadius), 5)}px`);

    // Add the temporary class
    $(cursor).addClass('cursor-mimic');
});

$('a, .btn, .navbar-toggler, button, .highlight').on('mouseleave', function () {
    ifMimic = false;
    $(cursor).removeClass('cursor-mimic');
});

//cursor and scrollbar by Alex Chai. alexchai97.github.io