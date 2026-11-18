import { Component } from 'react';
export class Boundary extends Component {
  state = { e: null };
  static getDerivedStateFromError(e) { return { e }; }
  componentDidCatch(e) { console.error('[Kampung Matematik]', e); this.props.onError?.(e); }
  render() { return this.state.e ? this.props.fallback : this.props.children; }
}
