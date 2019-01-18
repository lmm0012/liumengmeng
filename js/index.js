axios.defaults.baseURL = 'http://www.mige.in/develop';
varvm = new Vue({
	el: '#app',
	data: {
		// showLoding:false,
		id:0,
		fanye:0,
		detailData:{},
		zhulishuju:[],
		// gao:{'height':'6rem'},
		countDownDay: 1,
	    countDownHour: 0,
	    countDownMinute: 0,
	    countDownSecond: 0
	},
	
	// beforeCreate:function(){
	// 	console.log('组件创建之前')
	// 	console.log(this.id)
	// },
	// created:function(){
	// 	console.log('组件创建之后')
	// 	console.log(this.id)
	// },
	// beforeMount:function(){
	// 	console.log('组件挂载之前')
	// 	console.log(this.id)
	// },
	// mounted:function(){
	// 	console.log('组件挂载之后')
	// 	console.log(this.id)
	// },
	// beforeUpdate:function(){
	// 	console.log('组件跟新之qian')
	// 	console.log(this.id)
	// },
	// updated:function(){
	// 	console.log('组件跟新之后')
	// 	console.log(this.id)
 
	// },
	// beforeDestroy:function(){
	// 	console.log('组件销毁之前')
	// 	console.log(this.id)
	// 	this.id =1 
	// },
	// destroyed:function(){
	// 	console.log('组件销毁之后')
	// 	console.log(this.id)
	// 	this.id =1 
	// },
	created: function(){
		var option = {
			id:parseInt(this.getUrlQuery('id')) //parseInt 把数据转换number类型
		};
		console.log(this.getUrlQuery('id'));

		if(option.id){
			axios.get('/cgi-bin/api/freesamples/SamplesPhase/'+option.id+'/').then((res)=>{
				console.log(res); 
				this.detailData = res.data;
				res.data.beginremain = -123123 
				res.data.endremain = 545411;
				if (res.data.beginremain>0) {
					this.times(res.data.beginremain)
				}else{
					this.times(res.data.endremain)
				};
			}).catch((error)=>{
				console.log(error);
			}); 
			this.zhuli(0)
		};
	},
	methods: {
		getUrlQuery: function(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var key = window.location.search.substr(1).match(reg);
			return !!key? decodeURI(key[2]) : null
		},
		times:function(data){
			console.log(data)
			var data = Math.floor(data);
			var interval = setInterval(function () {
				var day = Math.floor(data/3600/24);
				var daystr = day.toString();
				if (daystr.length == 1) {
					daystr = '0'+ daystr 
				};
				var hours = Math.floor((data - day * 24 * 3600) / 3600);
				var hoursstr = hours.toString();
				if (hoursstr == 1) {
					hoursstr = '0' + hoursstr
				};
				var minutes = Math.floor((data - (day * 24 * 3600) - (hours * 3600)) / 60);
				var minutesstr = minutes.toString();
				if (minutesstr == 1) {
					minutesstr = '0' + minutesstr
				};
				var seconds = Math.floor((data - (day * 24 * 3600) - (hours * 3600) - (minutes * 60)));
				var secondsstr = seconds.toString();
				if (secondsstr == 1) {
					secondsstr = '0' + secondsstr
				};
				this.countDownDay = daystr;
				this.countDownHour = hoursstr;
				this.countDownMinute = minutesstr;
				this.countDownSecond = secondsstr;
				data-- ;
				if (data<0) {
					clearInterval(interval);
					this.countDownDay = daystr;
					this.countDownHour = hoursstr;
					this.countDownMinute = minutesstr;
					this.countDownSecond = secondsstr;
				};
			}.bind(this), 1000);
		},
		zhuli:function(val){
			var that = this
			this.id = parseInt(this.getUrlQuery('id'));
			if (this.zhulishuju.length<30) {
				axios.get('/cgi-bin/api/freesamples/RequestRecord/supportrank/?phase=' + this.id + '&limit=5&offset=' + 5 * val).then((res)=>{
					console.log(res)
					if (res.data.results.length > 0) {
					this.fanye ++;
					res.data.results.forEach(function(item){
						that.zhulishuju.push(item);
					})
					// this.gao={'height':this.zhulishuju.length*1.2+'rem'}
					}else{
						alert('到底了')
					}
				})
			}else{
				alert('只显示排名前30用户')
			}
		},
		chakangengduo:function(){
			this.zhuli(this.fanye)
		}
	}
})	