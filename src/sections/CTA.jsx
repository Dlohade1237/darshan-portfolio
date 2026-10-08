import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import ContactModal from "../components/ContactModel";


gsap.registerPlugin(
  ScrollTrigger,
  useGSAP
);


const GIANT_TEXT = [
  {
    text: "LET’S CREATE SOMETHING ",
    className: "",
  },
  {
    text: "MEANINGFUL.",
    className: "is-blue",
  },
];


export default function CTA() {

  const ctaRef = useRef(null);

  const giantTextRef =
    useRef(null);

  const contentRef =
    useRef(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);


  /* =========================================================
     HEADER → CONTACT MODAL
  ========================================================= */

  useEffect(() => {

    const handleOpenContactModal = () => {
      setIsModalOpen(true);
    };


    window.addEventListener(
      "open-contact-modal",
      handleOpenContactModal
    );


    return () => {

      window.removeEventListener(
        "open-contact-modal",
        handleOpenContactModal
      );

    };

  }, []);


  /* =========================================================
     GSAP CTA SCENE
  ========================================================= */

  useGSAP(
    () => {

      const mm =
        gsap.matchMedia();


      mm.add(
        {
          desktop:
            "(min-width: 1000px)",

          tablet:
            "(min-width: 577px) and (max-width: 999px)",

          mobile:
            "(max-width: 576px)",

          reducedMotion:
            "(prefers-reduced-motion: reduce)",
        },

        (context) => {

          const {
            desktop,
            tablet,
            mobile,
            reducedMotion,
          } = context.conditions;


          const giantText =
            giantTextRef.current;

          const content =
            contentRef.current;


          if (
            !giantText ||
            !content ||
            !ctaRef.current
          ) {
            return;
          }


          /* =================================================
             REDUCED MOTION
          ================================================= */

          if (reducedMotion) {

            gsap.set(
              giantText,
              {
                x: "-120%",
                y: 0,
              }
            );


            gsap.set(
              content,
              {
                opacity: 1,
                y: 0,
              }
            );


            return;
          }


          /* =================================================
             TEXT TRAVEL CALCULATION
             
             Function-based values are intentional.
             They recalculate on ScrollTrigger.refresh().
          ================================================= */

          const getStartX = () => {

            const viewportWidth =
              window.innerWidth;


            return (
              viewportWidth * 1.05
            );
          };


          const getEndX = () => {

            const viewportWidth =
              window.innerWidth;


            /*
              scrollWidth gives us the complete
              rendered width of the giant text.

              Extra 15vw guarantees that even
              the final "." completely leaves
              the viewport.
            */

            return (
              -giantText.scrollWidth -
              viewportWidth * 0.15
            );
          };


          /* =================================================
             INITIAL STATE
          ================================================= */

          gsap.set(
            giantText,
            {
              x: getStartX(),
              y: 0,
              scale: 1,
              rotation: 0,
            }
          );


          gsap.set(
            content,
            {
              y: 180,
              opacity: 0,
            }
          );


          /* =================================================
             MASTER TIMELINE
          ================================================= */

          const timeline =
            gsap.timeline({
              scrollTrigger: {

                trigger:
                  ctaRef.current,

                start:
                  "top top",

                /*
                  The section pins while this
                  complete timeline plays.

                  More distance = slower interaction.
                */

                end:
                  desktop
                    ? "+=2600"
                    : tablet
                    ? "+=2100"
                    : "+=1700",

                pin: true,

                scrub: 1.05,

                anticipatePin: 1,

                invalidateOnRefresh: true,

                fastScrollEnd: true,
              },
            });


          /* =================================================
             PHASE 1
             
             GIANT TEXT:
             RIGHT → LEFT
          ================================================= */

          timeline.to(
            giantText,
            {
              x: getEndX,

              duration:
                desktop
                  ? 2.15
                  : tablet
                  ? 1.95
                  : 1.75,

              ease: "none",
            }
          );


          /* =================================================
             PHASE 1.5
             
             VERY SHORT HOLD
             
             Gives the eye a moment after the
             final character disappears.
          ================================================= */

          timeline.to(
            giantText,
            {
              x: getEndX,

              duration:
                desktop
                  ? 0.10
                  : tablet
                  ? 0.10
                  : 0.08,

              ease: "none",
            }
          );


          /* =================================================
             PHASE 2
             
             CTA CONTENT ENTERS
          ================================================= */

          timeline.to(
            content,
            {
              y: 0,
              opacity: 1,

              duration:
                desktop
                  ? 0.85
                  : tablet
                  ? 0.90
                  : 1.00,

              ease:
                "power3.out",
            }
          );


          /* =================================================
             PHASE 2.5
             
             KEEP CONTENT STABLE UNTIL PIN ENDS
          ================================================= */

          timeline.to(
            content,
            {
              y: 0,
              opacity: 1,

              duration: 0.35,

              ease: "none",
            }
          );


          /* =================================================
             REFRESH
          ================================================= */

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });

        }
      );


      return () => {
        mm.revert();
      };

    },

    {
      scope:
        ctaRef,
    }
  );


  return (
    <>
      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section
        ref={ctaRef}
        className="final-cta"
        id="contact"
      >

        <div className="final-cta-stage">


          {/* =================================================
              GIANT SCROLLING TYPOGRAPHY
          ================================================= */}

          <div
            className="final-cta-giant"
            aria-hidden="true"
          >

            <div
              ref={giantTextRef}
              className="final-cta-giant-text"
            >
              {GIANT_TEXT.map((part, index) => (
                <span
                  key={index}
                  className={part.className}
                >
                  {part.text}
                </span>
              ))}
            </div>

          </div>


          {/* =================================================
              CTA CONTENT
              
              This stays hidden until the giant
              typography has completely exited.
          ================================================= */}

          <div
            ref={contentRef}
            className="final-cta-content"
          >

            <div
              className="final-cta-eyebrow"
            >
              LET&apos;S TALK
            </div>


            <p
              className="final-cta-heading"
            >
              Have a project, idea, or a problem to solve?
            </p>


            <p
              className="final-cta-description"
            >
              Let&apos;s turn it into a great experience together.
            </p>


            {/* =================================================
                CONTACT BUTTON
            ================================================= */}

            <button
              type="button"
              className="final-cta-button"
              onClick={() =>
                setIsModalOpen(true)
              }
            >

              <span>
                START A CONVERSATION
              </span>


              <span
                className="final-cta-arrow"
                aria-hidden="true"
              >

                <span
                  className="final-arrow-line"
                />

                <span
                  className="final-arrow-head"
                />

              </span>

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT MODAL
      ===================================================== */}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />

    </>
  );
}