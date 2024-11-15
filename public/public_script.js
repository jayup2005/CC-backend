let scroll;
            const body = document.body;
            const select = (e) => document.querySelector(e);
            const selectAll = (e) => document.querySelectorAll(e);

            let loops = gsap.utils.toArray('.title-single').map( (line, i) => {
                const links = line.querySelectorAll(".title-heading");
                return horizontalLoop(links, {
                    repeat: -1,
                    speed: 1 + i * 0.8,
                    reversed: false,
                    paddingRight: parseFloat(gsap.getProperty(links[0], "marginRight", "px"))
                });
            }
            );

            let currentScroll = 0;
            let scrollDirection = 1;

            window.addEventListener("scroll", () => {
                let direction = (window.pageYOffset > currentScroll) ? 1 : -1;
                if (direction !== scrollDirection) {
                    loops.forEach(tl => gsap.to(tl, {
                        timeScale: direction,
                        overwrite: true
                    }));
                    scrollDirection = direction;
                }
                currentScroll = window.pageYOffset;
            }
            );
            window.onload = function() {
                let slideIndex = 0;
                showSlides();
            
                function showSlides() {
                    let slides = document.getElementsByClassName("slide-container");
                    for (let i = 0; i < slides.length; i++) {
                        slides[i].style.display = "none";  // Hide all slides
                    }
                    slideIndex++;
                    if (slideIndex > slides.length) {
                        slideIndex = 1;  // Reset to the first slide
                    }
                    slides[slideIndex - 1].style.display = "block";  // Show the active slide
                    setTimeout(showSlides, 3000);  // Change slide every 3 seconds
                }
            };
            
            function showForm() {
                const formWrapper = document.querySelector('.form-wrapper');
                const contentWrapper = document.getElementById('page-wrapper');
            
                formWrapper.style.display = 'flex'; // Show the form wrapper
                contentWrapper.classList.add('blur-background'); // Add blur effect to the background
            
                // Ensure login fields are visible and sign-up fields are hidden
                document.getElementById('username-field').style.display = 'flex';
                document.getElementById('password-field').style.display = 'flex';
                document.getElementById('signup-fields').style.display = 'none';
              }
            
              function hideForm(event) {
                // Hide the form wrapper if the click is outside the form
                if (!event.target.closest('.form')) {
                  const formWrapper = document.querySelector('.form-wrapper');
                  const contentWrapper = document.getElementById('page-wrapper');
            
                  formWrapper.style.display = 'none';
                  contentWrapper.classList.remove('blur-background'); // Remove blur effect from the background
                }
              }
            function showcard() {
                const formWrapper = document.querySelector('.Card-wrapper');
                const contentWrapper = document.getElementById('page-wrapper');
            
                formWrapper.style.display = 'flex'; // Show the form wrapper
                contentWrapper.classList.add('blur-background'); // Add blur effect to the background
            
               
              }
            function hidecard(event) {
                // Hide the form wrapper if the click is outside the form
                if (!event.target.closest('.form')) {
                  const formWrapper = document.querySelector('.Card-wrapper');
                  const contentWrapper = document.getElementById('page-wrapper');
            
                  formWrapper.style.display = 'none';
                  contentWrapper.classList.remove('blur-background'); // Remove blur effect from the background
                }
              }
            
              function showSignUp() {
                // Hide the login fields (Username and Password)
                document.getElementById('username-field').style.display = 'none';
                document.getElementById('password-field').style.display = 'none';
                
                // Hide forget fields, if shown
                document.getElementById('forget-fields').style.display = 'none';
              
                // Show the signup fields
                document.getElementById('signup-fields').style.display = 'block';
              }
              
              function login() {
                // Hide the signup and forget fields
                document.getElementById('signup-fields').style.display = 'none';
                document.getElementById('forget-fields').style.display = 'none';
              
                // Show the login fields (Username and Password)
                document.getElementById('username-field').style.display = 'flex';
                document.getElementById('password-field').style.display = 'flex';
              }
              
              function forget() {
                // Hide the login fields (Username and Password)
                document.getElementById('username-field').style.display = 'none';
                document.getElementById('password-field').style.display = 'none';
              
                // Hide signup fields, if shown
                document.getElementById('signup-fields').style.display = 'none';
              
                // Show the forget fields
                document.getElementById('forget-fields').style.display = 'block';
              }
              

            function horizontalLoop(items, config) {
                items = gsap.utils.toArray(items);
                config = config || {};
                let tl = gsap.timeline({
                    repeat: config.repeat,
                    paused: config.paused,
                    defaults: {
                        ease: "none"
                    },
                    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
                }), length = items.length, startX = items[0].offsetLeft, times = [], widths = [], xPercents = [], curIndex = 0, pixelsPerSecond = (config.speed || 1) * 100, snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
                totalWidth, curX, distanceToStart, distanceToLoop, item, i;
                gsap.set(items, {
                    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
                    xPercent: (i, el) => {
                        let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                        xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
                        return xPercents[i];
                    }
                });
                gsap.set(items, {
                    x: 0
                });
                totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
                for (i = 0; i < length; i++) {
                    item = items[i];
                    curX = xPercents[i] / 100 * widths[i];
                    distanceToStart = item.offsetLeft + curX - startX;
                    distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
                    tl.to(item, {
                        xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
                        duration: distanceToLoop / pixelsPerSecond
                    }, 0).fromTo(item, {
                        xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
                    }, {
                        xPercent: xPercents[i],
                        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                        immediateRender: false
                    }, distanceToLoop / pixelsPerSecond).add("label" + i, distanceToStart / pixelsPerSecond);
                    times[i] = distanceToStart / pixelsPerSecond;
                }
                function toIndex(index, vars) {
                    vars = vars || {};
                    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
                    // always go in the shortest direction
                    let newIndex = gsap.utils.wrap(0, length, index)
                      , time = times[newIndex];
                    if (time > tl.time() !== index > curIndex) {
                        // if we're wrapping the timeline's playhead, make the proper adjustments
                        vars.modifiers = {
                            time: gsap.utils.wrap(0, tl.duration())
                        };
                        time += tl.duration() * (index > curIndex ? 1 : -1);
                    }
                    curIndex = newIndex;
                    vars.overwrite = true;
                    return tl.tweenTo(time, vars);
                }
                tl.next = vars => toIndex(curIndex + 1, vars);
                tl.previous = vars => toIndex(curIndex - 1, vars);
                tl.current = () => curIndex;
                tl.toIndex = (index, vars) => toIndex(index, vars);
                tl.times = times;
                if (config.reversed) {
                    tl.vars.onReverseComplete();
                    tl.reverse();
                }
                return tl;
            }

            $('.color-option-w').click(function() {
                let currentColor = $(this).attr("data-color");
                Cookies.set("colorMode", currentColor, {
                    expires: 14
                });
                //save color preference on change
            });

            // Function to toggle classes
            const toggleClasses = (color) => {
                const classMap = {
                    black: ['is-black', 'black-bg'],
                    green: ['is-green', 'green-bg'],
                    brown: ['is-brown', 'brown-bg'],
                };
                const elements = ['.loader-wrapper', '.section', 'body', '.menu-overlay', '.menu-line','.form','.field'];

                elements.forEach(el => {
                    $(el).removeClass('is-black is-green is-brown');
                    $(el).addClass(classMap[color][0]);
                }
                );
                $('body').removeClass('black-bg green-bg brown-bg');
                $('body').addClass(classMap[color][1]);
            }
            ;

            // Set initial class based on cookie value
            const colorMode = Cookies.get("colorMode");
            if (colorMode)
                toggleClasses(colorMode);

            // Toggle classes on button click
            $('#black-color').click( () => toggleClasses('black'));
            $('#green-color').click( () => toggleClasses('green'));
            $('#brown-color').click( () => toggleClasses('brown'));

            // Footer bg grow from full viewport size
            $(".section.is-footer").each(function(index) {
                let triggerElement = $(this);
                let targetElement = $(".footer-bg");
                let tl = gsap.timeline({
                    
                });
                tl.fromTo(targetElement, {
                    width: "100vw",
                    height: "100vh",
                    borderRadius: "0em",
                    duration: 1
                }, {
                    width: "100%",
                    height: "100%",
                    borderRadius: "1em",
                    duration: 1
                });
            });

            //100vh minus Safari nav
            const appHeight = () => {
                const doc = document.documentElement;
                doc.style.setProperty('--app-height', `${window.innerHeight}px`);
            }
            window.addEventListener('resize', appHeight);
            appHeight();
            window.addEventListener('DOMContentLoaded', (event) => {
                appHeight();
            }
            );
        

            //Register Scroll Trigger library
            gsap.registerPlugin(ScrollTrigger);

            $('.menu-link-w.is--anchor').click(function() {
                $(".menu-btn").trigger("click");
            });

            //By Timothy Ricks
            window.addEventListener("DOMContentLoaded", (event) => {
                // Split text into spans
                let typeSplit = new SplitType("[text-split]",{
                    types: "words, chars",
                    tagName: "span"
                });
                function createScrollTrigger(triggerElement, timeline) {
                    ScrollTrigger.create({
                        trigger: triggerElement,
                        start: "top bottom",
                        onLeaveBack: () => {
                            timeline.progress(0);
                            timeline.pause();
                        },
                        once:true,
                    });
                    ScrollTrigger.create({
                        trigger: triggerElement,
                        start: "top 100%",
                        onEnter: () => timeline.play(),
                        
                    });
                }

               

                $("[letters-slide-down]").each(function(index) {
                    let tl = gsap.timeline({
                        paused: true
                    });
                    tl.from($(this).find(".char"), {
                        yPercent: -120,
                        duration: 0.3,
                        ease: "power1.out",
                        stagger: {
                            amount: 0.5
                        },
                        once : true, 
                    });
                    createScrollTrigger($(this), tl);
                });

                $("[archive-slide-down]").each(function(index) {
                    let tl = gsap.timeline({
                        paused: true
                    });
                    tl.from($(this).find(".char"), {
                        yPercent: -120,
                        duration: 0.3,
                        ease: "power1.out",
                        stagger: {
                            amount: 0.5
                        },
                        once : true, 
                    });
                    archiveLetters($(this), tl);
                });

                $("[words-slide-down]").each(function(index) {
                    let tl = gsap.timeline({
                        paused: true
                    });
                    tl.from($(this).find(".char"), {
                        opacity: 0,
                        yPercent: -100,
                        duration: 0.5,
                        ease: "power1.out",
                        stagger: {
                            amount: 0.5
                        },
                        once : true, 
                    });
                    createScrollTrigger($(this), tl);
                });

                $("[fade-up]").each(function(index) {
                    let tl = gsap.timeline({
                        paused: true
                    });
                    tl.from($(this), {
                        opacity: 0,
                        yPercent: 100,
                        duration: 0.5,
                        ease: "power1.out",
                        once : true, 
                    });
                    createScrollTrigger($(this), tl);
                });

                // Avoid flash of unstyled content
                gsap.set("[text-split]", {
                    opacity: 1
                });
            }
            );

            // Sticky event cards
            $(".Events-item").each(function(index) {
                let triggerElement = $(this);
                let targetElement = $(this).prev();
                let eventCards = gsap.timeline({

                    scrollTrigger: {
                        trigger: triggerElement,
                        start: "top 75%",
                        end: "top top",
                        scrub: 1
                    }
                });
                eventCards.fromTo(targetElement, {
                    scale: "1",
                    duration: 1
                }, {
                    scale: "0.8",
                    duration: 1
                })
                eventCards.fromTo(triggerElement, {
                    boxShadow: '0rem 0rem 0rem 0rem rgba(0,0,0,1)',
                    duration: 1
                }, {
                    boxShadow: '0rem -4rem 10rem 0rem rgba(0,0,0,1)',
                    duration: 1
                })
            });

            // variables for Page Loader
            let customEase = "M0,0,C0.25,0,0.294,0.023,0.335,0.05,0.428,0.11,0.466,0.292,0.498,0.502,0.532,0.73,0.586,0.88,0.64,0.928,0.679,0.962,0.698,1,1,1";
            let loaderDuration = 2;
            let loaderDurationFirst = 0.5;
            let loaderOffset = 1.6;
            let loaderOffsetSmall = 0.2;

            //If not a first time visit in this tab
            if (sessionStorage.getItem("visited") !== null) {
                loaderDuration = 2;
                loaderDurationFirst = 0.5;
                loaderOffset = 1.6;
                loaderOffsetSmall = 0.2;

            }
            sessionStorage.setItem("visited", "true");

            function endLoaderAnimation() {
                setTimeout(function() {
                    $(".loader-trigger").click();
                }, 600);
            }

            let loaderTimeline = gsap.timeline({
                onComplete: endLoaderAnimation
            });
            loaderTimeline.to(".counter-span.is--hundreds", {
                y: "-111%",
                duration: loaderDurationFirst,
                ease: customEase,
            }, loaderOffset);
            loaderTimeline.to(".counter-span.is--tens", {
                y: "-1111%",
                duration: loaderDuration,
                ease: customEase,
            }, loaderOffsetSmall);
            loaderTimeline.to(".counter-span.is--ones", {
                y: "-11111%",
                duration: loaderDuration,
                ease: customEase,
            }, 0);

           

            //Awards Image preview velocity based animation
            Observer.create({
                target: window,
                type: "pointer",
                onMove: (self) => {
                    let velocity = self.velocityX * 0.01;
                    let amount = gsap.utils.clamp(-15, 15, velocity);
                    let duration = Math.abs(amount * 0.08);
                    let clampedDuration = gsap.utils.clamp(0.1, 0.9, duration);
                    let tl = gsap.timeline();
                    let tlTwo = gsap.timeline();
                    tl.to(".awards_img-width", {
                        rotate: amount + "deg",
                        ease: "none",
                        duration: 0.2,
                        overwrite: true
                    }).to(".awards_img-width", {
                        rotate: "0deg",
                        ease: "power1",
                        duration: 0.4
                    }),
                    tlTwo.to(".footer-emoji", {
                        rotate: amount + "deg",
                        ease: "none",
                        duration: 0.2,
                        overwrite: true
                    }).to(".footer-emoji", {
                        rotate: "0deg",
                        ease: "power1",
                        duration: 0.4
                    });
                }
            });

            
            
