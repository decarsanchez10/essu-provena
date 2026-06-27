import { onMounted, onUnmounted } from 'vue'

// Each animation type has enter + optionally exit styles for infinite re-triggering
const animations = {
  fadeUp: {
    hidden:  'opacity:0; transform:translateY(40px)',
    visible: 'opacity:1; transform:translateY(0)',
  },
  fadeDown: {
    hidden:  'opacity:0; transform:translateY(-40px)',
    visible: 'opacity:1; transform:translateY(0)',
  },
  fadeLeft: {
    hidden:  'opacity:0; transform:translateX(-50px)',
    visible: 'opacity:1; transform:translateX(0)',
  },
  fadeRight: {
    hidden:  'opacity:0; transform:translateX(50px)',
    visible: 'opacity:1; transform:translateX(0)',
  },
  zoomIn: {
    hidden:  'opacity:0; transform:scale(0.75)',
    visible: 'opacity:1; transform:scale(1)',
  },
  zoomOut: {
    hidden:  'opacity:0; transform:scale(1.2)',
    visible: 'opacity:1; transform:scale(1)',
  },
  flipX: {
    hidden:  'opacity:0; transform:rotateX(60deg)',
    visible: 'opacity:1; transform:rotateX(0deg)',
  },
  flipY: {
    hidden:  'opacity:0; transform:rotateY(60deg)',
    visible: 'opacity:1; transform:rotateY(0deg)',
  },
  slideUp: {
    hidden:  'opacity:0; transform:translateY(60px) skewY(3deg)',
    visible: 'opacity:1; transform:translateY(0) skewY(0deg)',
  },
  blurIn: {
    hidden:  'opacity:0; filter:blur(12px)',
    visible: 'opacity:1; filter:blur(0)',
  },
}

function applyStyle(el, styleStr) {
  styleStr.split(';').forEach(s => {
    const [prop, val] = s.split(':').map(x => x.trim())
    if (prop && val) {
      // convert kebab to camelCase
      const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      el.style[camel] = val
    }
  })
}

export function useScrollAnimate(getEls, type = 'fadeUp', options = {}) {
  const {
    duration = 700,
    easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
    threshold = 0.12,
    infinite = true,   // re-animate when scrolled back past
    stagger = 0,       // ms delay between each el if array
  } = options

  let io

  onMounted(() => {
    const anim = animations[type] || animations.fadeUp

    io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el = entry.target
        const delay = el._saDelay || 0

        if (entry.isIntersecting) {
          el.style.transition = `all ${duration}ms ${easing} ${delay}ms`
          applyStyle(el, anim.visible)
          el._saVisible = true
        } else if (infinite && el._saVisible) {
          // reset so it re-animates on scroll back
          el.style.transition = 'none'
          applyStyle(el, anim.hidden)
          el._saVisible = false
        }
      })
    }, { threshold })

    const els = typeof getEls === 'function' ? getEls() : getEls
    const list = Array.isArray(els) ? els : [els]

    list.forEach((el, i) => {
      if (!el) return
      el._saDelay = stagger * i
      // set initial hidden state instantly
      el.style.transition = 'none'
      applyStyle(el, anim.hidden)
      io.observe(el)
    })
  })

  onUnmounted(() => io?.disconnect())
}