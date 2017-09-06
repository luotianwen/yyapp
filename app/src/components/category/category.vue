<template>
	<div>
		<div class="category" v-show="isShow">
			<div class="header p_fixed">
				<div class="input_btn">
					<a></a>
					<input type="search" placeholder="户外跑鞋" @click="showSearch" />
				</div>
				<span>
			</span>
			</div>
			<div class="egy_content">
				<div class="big_classify">
					<div class="stair">
						<div class="s_list">
							<div class="s_item" :class="{'active':selectedCategory.id==item.id}" v-for="item in cList" @click="selectedCategory=item">
								<p><span>{{item.name}}</span></p>
							</div>

						</div>
					</div>
					<div class="second_level">
						<div class="sl_content">
							<div class="sl_list">
							<div class="s_item" v-for="category in  selectedCategory.child">
								<div class="title">{{category.descript}}</div>
								<div class="sl_menu clearfix">
									<ul class="clearfix">
										<li v-for="c in category.child" @click="$router.push({name:'productList',query:{c:c.id}})">
                      <img :src="c.image" />
                      <span>{{c.descript}}</span></li>

									</ul>
								</div>
							</div>

						</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<v-search ref="search" v-on:child-update="updateShow"></v-search>
	</div>
</template>
<script>
	import { XInput, XHeader, Group, Cell } from 'vux'

	import VSearch from '../search/search.vue'
	export default {
		components: {
			XInput,
			XHeader,
			Group,
			Cell,

			VSearch
		},
		data() {
			return {
				cList: {},
				selectedList: {},
				isShow: true,
				selectedCategory: {}
			}
		},
		methods: {
			showSearch() {
				this.$refs.search.show();
				this.isShow = false;
			},
			updateShow() {
				this.isShow = true;
			},
			initData() {
				var that = this;
				that.$post(that.$interface_url.category.getCategoryNavigation, {}, function(data, success) {
					if(success) {

						that.cList = data;
						that.selectedCategory = data[0];
					}
				});
			},
			selectedCategory(item) {
				this.selectedList = item;
				this.$refs.tcategory.show();
			}
		},
		created() {
			this.initData();
		}
	}
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../assets/css/category.less";
	i,
	em {
		font-style: normal;
	}
</style>
