import Vue, { VNodeDirective, VNode } from 'vue';


Vue.directive('validateField', {
  bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    const comp = vnode.componentInstance;
    const field = binding.value;

    el.setAttribute('data-vv-name', field.name);
    el.setAttribute('data-vv-as', field.readableName || field.placeholder);
    el.setAttribute('data-vv-value-path', binding.arg || 'value_validate');
  }
});
