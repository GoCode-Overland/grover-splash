document.addEventListener('DOMContentLoaded', function() {
  // Initialize all scroll effects
  initScrollEffects();
});

function initScrollEffects() {
  // Select all elements with data-scroll-effect attribute
  const scrollElements = document.querySelectorAll('[data-scroll-effect]');
  
  // Group elements by their rootMargin settings to minimize the number of observers
  const observerGroups = new Map();
  
  // Process each element and assign to appropriate observer group
  scrollElements.forEach(element => {
    // Get custom rootMargin if specified, or use default
    const topOffset = element.dataset.scrollOffset ? parseInt(element.dataset.scrollOffset) : 0;
    const bottomOffset = element.dataset.scrollBottomOffset ? parseInt(element.dataset.scrollBottomOffset) : 0;
    const rootMargin = `${topOffset}px 0px ${bottomOffset}px 0px`;

    // Get custom thresholds if specified, or use default
    let thresholds = [1];//[0, 0.25, 0.5, 0.75, 1];
    if (element.dataset.scrollThresholds) {
      try {
        thresholds = JSON.parse(element.dataset.scrollThresholds);
      } catch (e) {
        console.warn('Invalid scrollThresholds format. Using defaults.', e);
      }
    }
    
    // Create a key for this configuration
    const configKey = `${rootMargin}|${thresholds.join(',')}`;
    
    // Add element to the appropriate group
    if (!observerGroups.has(configKey)) {
      observerGroups.set(configKey, {
        elements: [],
        config: { rootMargin, thresholds }
      });
    }
    
    observerGroups.get(configKey).elements.push(element);
    
    // Initialize SVG paths that should be drawn
    if (element.dataset.scrollEffect.includes('path-draw')) {
      preparePathForDrawing(element);
    }
  });
  
  // Create and setup observers for each group
  observerGroups.forEach(group => {
    const { elements, config } = group;
    
    // Create observer with this configuration
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const effect = element.dataset.scrollEffect;
        
        if (entry.isIntersecting) {
          // Check if there's a delay specified
          const delay = parseInt(element.dataset.scrollEffectDelay || 0);
          
          // Apply the effect class when element is visible (with delay if specified)
          if (delay > 0) {
            // Store timeout ID on the element to allow cancellation if needed
            element._effectTimeout = setTimeout(() => {
              element.classList.add(`effect-${effect.split(' ')[0]}-active`);
              
              // Special handling for SVG path drawing
              if (effect.includes('path-draw')) {
                initPathDrawing(element);
              }
              
              // Trigger custom event that can be listened to
              element.dispatchEvent(new CustomEvent('effect:visible', { 
                detail: { effect, intersectionRatio: entry.intersectionRatio }
              }));
            }, delay);
          } else {
            // Apply immediately if no delay
            element.classList.add(`effect-${effect.split(' ')[0]}-active`);
            
            // Special handling for SVG path drawing
            if (effect.includes('path-draw')) {
              initPathDrawing(element);
            }
            
            // Trigger custom event that can be listened to
            element.dispatchEvent(new CustomEvent('effect:visible', { 
              detail: { effect, intersectionRatio: entry.intersectionRatio }
            }));
          }
          
          // For elements that need continuous updates while visible
          if (element.dataset.scrollContinuous === 'true') {
            element.dataset.isVisible = 'true';
          }
        } else {
          // Clear any pending timeouts if element goes out of view before effect is applied
          if (element._effectTimeout) {
            clearTimeout(element._effectTimeout);
            element._effectTimeout = null;
          }
          
          // Optionally remove the effect when element is not visible
          if (element.dataset.scrollReset === 'true') {
            element.classList.remove(`effect-${effect.split(' ')[0]}-active`);
          }
          
          if (element.dataset.scrollContinuous === 'true') {
            element.dataset.isVisible = 'false';
          }
          
          // Remove path drawing event listener when out of view
          if (effect.includes('path-draw')) {
            window.removeEventListener('scroll', element._updatePathDraw);
          }
          
          // Trigger custom event that can be listened to
          element.dispatchEvent(new CustomEvent('effect:hidden', { 
            detail: { effect }
          }));
        }
      });
    }, {
      threshold: config.thresholds,
      rootMargin: config.rootMargin
    });
    
    // Observe all elements in this group
    elements.forEach(element => {
      observer.observe(element);
    });
  });
  
  // For elements that need continuous updates (like parallax)
  window.addEventListener('scroll', () => {
    const continuousElements = document.querySelectorAll('[data-scroll-continuous="true"][data-is-visible="true"]');
    
    continuousElements.forEach(element => {
      const effects = element.dataset.scrollEffect.split(' ');
      let transforms = [];

      // Process each effect
      effects.forEach(effect => {
        switch (effect) {
          case 'parallax':
            transforms.push(getParallaxTransform(element));
            break;
          case 'rotate':
            transforms.push(getRotateTransform(element));
            break;
          case 'scale':
            transforms.push(getScaleTransform(element));
            break;
          // Add more effect types as needed
        }
      });
      
      // Apply all transforms
      if (transforms.length > 0) {
        element.style.transform = transforms.join(' ');
      }
    });
  });
  
  // SVG Path Drawing Functions
  function preparePathForDrawing(element) {
    // Find all paths within the element
    const paths = element.querySelectorAll('path');
    
    paths.forEach(path => {
      // Get the total length of the path
      const pathLength = path.getTotalLength();
      
      // Store the path length on the path element
      path._pathLength = pathLength;
      
      // Set up initial styles for the path
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      path.style.transition = 'none'; // Disable transitions for initial setup
    });
  }
  
  function initPathDrawing(element) {
    // Create the update function
    element._updatePathDraw = function() {
      // Get the position of the element relative to the viewport
      const rect = element.getBoundingClientRect();
      
      // Calculate the center of the element
      const elementCenter = rect.top - 400 + rect.height / 2;
      
      // Calculate the center of the viewport
      const viewportCenter = window.innerHeight / 2;
      
      // Calculate the distance from the element center to the viewport center
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Define the scroll range (use data attribute or default to 100px)
      const scrollRange = parseFloat(element.dataset.pathDrawRange || 100);
      
      // Calculate the progress (0 to 1) based on the scroll position
      let progress = 1 - Math.max(0, Math.min(1, (distanceFromCenter + scrollRange/2) / scrollRange));
      
      // Update all paths within the element
      const paths = element.querySelectorAll('path');

      paths.forEach(path => {
        if (path._pathLength) {
          path.style.strokeDashoffset = path._pathLength * (1 - progress);
        }
      });
    };
    
    // Add scroll listener
    window.addEventListener('scroll', element._updatePathDraw);
    
    // Initial update
    element._updatePathDraw();
  }
  
  // Transform calculation functions
  function getParallaxTransform(element) {
    const speed = parseFloat(element.dataset.parallaxSpeed || 0.5);
    const baseOffset = parseFloat(element.dataset.parallaxOffset || 0);
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far the element is through the viewport (0 at top, 1 at bottom)
    const elementProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    
    // Use either scroll-based or viewport-position-based calculation
    let translateY;
    if (element.dataset.parallaxMode === 'viewport') {
      // Viewport-relative calculation (smoother for elements that stay on screen longer)
      translateY = baseOffset + (elementProgress * 100 * speed);
    } else {
      // Default scroll-based calculation
      const scrollPos = window.scrollY;
      translateY = baseOffset + (scrollPos * speed);
    }
    
    return `translateY(${translateY}px)`;
  }
  
  function getRotateTransform(element) {
    const speed = parseFloat(element.dataset.rotateSpeed || 0.1);
    const baseOffset = parseFloat(element.dataset.rotateOffset || 0);
    const scrollPos = window.scrollY;
    const rotation = baseOffset + (scrollPos * speed);
    return `rotate(${rotation}deg)`;
  }
  
  function getScaleTransform(element) {
    const speed = parseFloat(element.dataset.scaleSpeed || 0.001);
    const baseScale = parseFloat(element.dataset.scaleBase || 1);
    const scrollPos = window.scrollY;
    const scale = baseScale + (scrollPos * speed);
    
    return `scale(${scale})`;
  }
}



// Control floating CTA visibility
const floatingCta = document.getElementById('floating-cta');
const signupSection = document.getElementById('signup');

const handleScroll = () => {
  const viewportHeight = window.innerHeight;
  const signupRect = signupSection.getBoundingClientRect();
  const isSignupVisible = signupRect.top <= viewportHeight;

  if (window.scrollY > viewportHeight && !isSignupVisible) {
    floatingCta.style.transform = 'translateY(0)';
  } else {
    floatingCta.style.transform = 'translateY(200%)';
  }
};

window.addEventListener('scroll', handleScroll);


// Cycling Text
const textOptions = ["weekend warriors", "vanlifers", "boondockers", "adVANturers", "offgridders", "RV explorers", "you"];

document.addEventListener('DOMContentLoaded', () => {
  const cyclingTextElements = document.querySelectorAll('[data-cycling-text]');
  for(let i=0; i<cyclingTextElements.length; i++) {
    const cyclingTextElement = cyclingTextElements[i];
    
    let currentIndex = 0;
    
    function updateText() {
      // First erase the current text
      eraseText(cyclingTextElement, () => {
        // Then write the new text
        currentIndex = (currentIndex + 1) % textOptions.length;
        writeText(cyclingTextElement, textOptions[currentIndex]);
      });
    }
    
    function eraseText(element, callback) {
      let text = element.textContent;
      const interval = setInterval(() => {
        if (text.length > 0) {
          text = text.substring(0, text.length - 1);
          element.textContent = text;
        } else {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 50);
    }
    
    function writeText(element, text) {
      let index = 0;
      element.textContent = '';
      
      const interval = setInterval(() => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(interval);
          // Wait before starting the next cycle
          setTimeout(updateText, 2000);
        }
      }, 100);
    }
    
    // Start the animation after a delay
    setTimeout(updateText, 2000);
  }
});


/* Hero Effects - Deferred loading to prevent reflow */
function loadVivusScript() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vivus/0.4.6/vivus.min.js';
  script.integrity = 'sha512-oUUeA7VTcWBqUJD/VYCBB4VeIE0g1pg5aRMiSUOMGnNNeCLRS39OlkcyyeJ0hYx2h3zxmIWhyKiUXKkfZ5Wryg==';
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'no-referrer';
  script.async = true;
  document.head.appendChild(script);
  return script;
}

// Load Vivus during idle time to prevent render blocking
function initVivusWhenIdle() {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      const script = loadVivusScript();
      setupVivusAnimations(script);
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      const script = loadVivusScript();
      setupVivusAnimations(script);
    }, 1000);
  }
}

function setupVivusAnimations(script) {
  script.addEventListener('load', () => {
  const bgSvg = document.querySelector('[data-hero-bg]');
  new Vivus(bgSvg, {
    type: 'sync', 
    duration: 250,
    reverseStack: true,
    onReady: () => {
      setTimeout(() => {
        const vanSvg = document.querySelector('[data-hero-van]');
        new Vivus(vanSvg, {
          type: 'sync',
          duration: 70,
          reverseStack: true,
        });
        vanSvg.classList.add('hero-effect-fade-active')
      }, 750);
    }
  });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVivusWhenIdle);
} else {
  initVivusWhenIdle();
}
