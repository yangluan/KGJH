;
define(function(require, exports, module) {
	var loaderMore = require("templates/control/loaderMore.html");
	var common = require("common");
	require('css/control/loaderMore.css');
	var VueComponent = Vue.extend({
		template: loaderMore,
		props: {
			offset: {
				type: Number,
				default: 40
			},
			enableInfinite: {
				type: Boolean,
				default: true
			},
			enableRefresh: {
				type: Boolean,
				default: true
			},
			onRefresh: {
				type: Function,
				default: undefined,
				required: false
			},
			onInfinite: {
				type: Function,
				default: undefined,
				require: false
			}
		},
		data() {
			return {
				top: 0,
				state: 0,
				startY: 0,
				touching: false,
				infiniteLoading: false
			}
		},
		methods: {
			touchStart(e) {
				this.startY = e.targetTouches[0].pageY ;
				this.startScroll = this.$el.scrollTop || 0 ;
				this.touching = true ;
			},
			touchMove(e) {
				if(!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
					return ;
				} ;
			var diff = e.targetTouches[0].pageY - this.startY - this.startScroll ;
				if(diff > 0) e.preventDefault() 
				this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)

				if(this.state === 2) { // in refreshing
					return
				}
				if(this.top >= this.offset) {
					this.state = 1
				} else {
					this.state = 0
				}
			},
			touchEnd(e) {
				if(!this.enableRefresh) return
				this.touching = false
				if(this.state === 2) { // in refreshing
					this.state = 2
					this.top = this.offset
					return
				}
				if(this.top >= this.offset) { // do refresh
					this.refresh()
				} else { // cancel refresh
					this.state = 0
					this.top = 0
				}
			},
			refresh() {
				this.state = 2
				this.top = this.offset
				this.onRefresh(this.refreshDone)
			},
			refreshDone() {
				this.state = 0
				this.top = 0
			},

			infinite() {
				this.infiniteLoading = true
				this.onInfinite(this.infiniteDone)
			},

			infiniteDone() {
				this.infiniteLoading = false
			},

			onScroll(e) {
				if(!this.enableInfinite || this.infiniteLoading) {
					return
				};
				var outerHeight = this.$el.clientHeight ;
				var innerHeight = this.$el.querySelector('.inner').clientHeight ;
				var scrollTop = this.$el.scrollTop ;
				var ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0 ;
				var infiniteHeight = this.$el.querySelector('.load-more').clientHeight ;
				var bottom = innerHeight - outerHeight - scrollTop - ptrHeight ;
				if(bottom < infiniteHeight) this.infinite() ;
			},
		},
	});

	module.exports = VueComponent;
});