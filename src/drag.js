export default {
  install: (app, options = {}) => {
    app.directive("drag", {
      mounted(el, binding) {
        if (typeof binding.value != "function") {
          throw new Error("callback must be a function!");
        }

        options.threshold = options.threshold || 10;

        let startX = 0,
          startY = 0,
          success = false;

        const down = (event) => {
          success = false;
          startX = event.clientX;
          startY = event.clientY;
        };

        const move = (event) => {
          const deltaX = event.clientX - startX,
            deltaY = event.clientY - startY,
            distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (!success && distance > options.threshold) {
            success = true;

            binding.value({
              target: el,
              type: "drag:start",
              startX,
              startY,
              deltaX: 0,
              deltaY: 0,
            });
          }

          if (!success) {
            return;
          }

          binding.value({
            target: el,
            type: "drag:move",
            startX,
            startY,
            deltaX,
            deltaY,
          });
        };

        const up = (event) => {
          if (!success) {
            return;
          }

          const deltaX = event.clientX - startX,
            deltaY = event.clientY - startY;

          binding.value({
            target: el,
            type: "drag:end",
            startX,
            startY,
            deltaX,
            deltaY,
          });
        };

        const listeners = new Map();
        el.listeners = listeners;

        listeners.set("touchstart", () => {
          const listeners = new Map();

          listeners.set("touchstart", (event) => {
            down({
              clientX: event.targetTouches[0].clientX,
              clientY: event.targetTouches[0].clientY,
            });
          });

          listeners.set("touchmove", (event) => {
            move({
              clientX: event.targetTouches[0].clientX,
              clientY: event.targetTouches[0].clientY,
            });
          });

          listeners.set("touchend", (event) => {
            up({
              clientX: event.changedTouches[0].clientX,
              clientY: event.changedTouches[0].clientY,
            });

            listeners.forEach((listener, event) => {
              document.removeEventListener(event, listener);
            });
          });

          listeners.forEach((listener, event) => {
            document.addEventListener(event, listener);
          });
        });

        listeners.set("mousedown", (event) => {
          const listeners = new Map();

          listeners.set("mousedown", (event) => {
            down({ clientX: event.clientX, clientY: event.clientY });
          });

          listeners.set("mousemove", (event) => {
            move({ clientX: event.clientX, clientY: event.clientY });
          });

          listeners.set("mouseup", (event) => {
            up({ clientX: event.clientX, clientY: event.clientY });

            listeners.forEach((listener, event) => {
              document.removeEventListener(event, listener);
            });
          });

          listeners.forEach((listener, event) => {
            document.addEventListener(event, listener);
          });
        });

        listeners.forEach((listener, event) => {
          el.addEventListener(event, listener);
        });
      },

      unmounted(el, binding) {
        const { listeners } = el;

        listeners.forEach((listener, event) => {
          el.removeEventListener(event, listener);
        });
      },
    });
  },
};
