// https://medium.com/@arunsivan18.8/vue-js-fallback-image-directive-4609a09afe4f

export default {
    bind(el, binding) {
      try {
        const { value } = binding;
        const loader = '/null.png';
        const fallBackImage = '/null.png';
        const img = new Image();
        let loading = loader;
        let error = fallBackImage;
        let original = el.src;
        if (typeof value === 'string') {
          loading = value;
          error = value;
        }
        if (value instanceof Object) {
          loading = value.imageLoader || loader;
          error = value.fallBackImage || fallBackImage;
        }
        img.src = original;
        el.src = loading;
        img.onload = () => {
          el.src = original;
        };
        img.onerror = () => {
          el.src = error;
        };
      } catch (e) {
        console.log(e)
      }
    }
  }