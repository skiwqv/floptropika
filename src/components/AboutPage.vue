<template>
  <div class="about__wrapper">
    <h1 class="about__title" ref="title">About Floptok</h1>
    <div class="about__text__container">
      <p class="about__text" ref="paragraph1">
        Floptok is a space on TikTok where users share their failures and funny
        moments. It's a place where self-irony and humor are paramount. In our
        community, you'll find numerous funny videos, memes, and viral trends.
      </p>
      <p class="about__text" ref="paragraph2">
        The main heroes of Floptok are ordinary people showing their fails and
        hilarious situations. Here, you can be yourself and not be afraid to be
        funny! We celebrate the imperfect, the quirky, and the downright
        ridiculous.
      </p>
      <p class="about__text" ref="paragraph3">
        Whether it's a cooking disaster, a workout fail, or just a goofy dance,
        Floptok is where you'll find it. Join us and embrace the joy of
        flopping, because sometimes the best moments in life are the ones that
        go wrong.
      </p>
    </div>
    <div ref="photo1">
      <img src="../assets/images/jiafei.png" class="about__photo" />
    </div>
    <div class="scroll-content">
      <p class="about__text" ref="paragraph4">
        As you scroll down, more fun content appears. Each scroll reveals new
        surprises and laughter-inducing moments.
      </p>
      <p class="about__text" ref="paragraph5">
        Keep scrolling to see the unexpected and hilarious outcomes of everyday
        situations shared by our community members.
      </p>
      <div ref="photo2">
        <img src="../assets/images/baba.jpg" class="about__photo" />
      </div>
      <div class="height"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const title = ref(null);
const paragraph1 = ref(null);
const paragraph2 = ref(null);
const paragraph3 = ref(null);
const paragraph4 = ref(null);
const paragraph5 = ref(null);
const photo1 = ref(null);
const photo2 = ref(null);

onMounted(() => {
  const timeline = gsap.timeline();

  // Initial animations
  timeline.from(title.value, {
    x: -300,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
  });

  timeline.from(
    paragraph1.value,
    {
      x: -200,
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    },
    "-=1"
  );

  timeline.from(
    paragraph2.value,
    {
      scale: 0.5,
      rotate: 180,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
    },
    "-=0.8"
  );

  timeline.from(
    paragraph3.value,
    {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
    },
    "-=0.8"
  );

  timeline.from(
    photo1.value,
    {
      scale: 0.5,
      rotate: -360,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=1.2"
  );

  // Scroll-triggered animations
  gsap.from(paragraph4.value, {
    scrollTrigger: {
      trigger: paragraph4.value,
      start: "top 80%",
      toggleActions: "play none none none",
      scrub: true,
    },
    x: 200,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
  });

  gsap.from(paragraph5.value, {
    scrollTrigger: {
      trigger: paragraph5.value,
      start: "top 80%",
      toggleActions: "play none none none",
      scrub: true,
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
  });

  gsap.from(photo2.value, {
    scrollTrigger: {
      trigger: photo2.value,
      start: "top 80%",
      toggleActions: "play none none none",
      scrub: true,
    },
    scale: 0.5,
    rotation: 1100,
    opacity: 0,
    ease: "power4.out",
  });
});
</script>

<style scoped>
.about__wrapper {
  text-align: center;
  padding: 20px;
}

.about__title {
  font-size: 36px;
  color: #1a1a7e;
  margin-bottom: 20px;
}

.about__text__container,
.scroll-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  border-radius: 10px;
}

.about__text {
  font-size: 18px;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.6;
}

.about__photo {
  max-width: 250px;
  max-height: 250px;
  border-radius: 10px;
  transition: transform 0.3s ease;
  margin-top: 20px;
}
.height {
  height: 250px;
}
</style>
