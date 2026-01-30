<template>
  <div class="album">
    <van-field v-model="fieldValue" is-link readonly label="日期" placeholder="选择日期" @click="showPicker = true"
      input-align="right" />
    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom">
      <van-picker :model-value="pickerValue" :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>

    <van-tabs class="vanTabs" type="card">
      <van-tab title="图片">
        <template v-if="imageList.length > 0">
          <img class="tabImg" v-for="(img, index) in imageList" v-lazy="img" :key="index" @click="showImg(index)" />
        </template>
        <van-empty v-else description="暂无数据" />
      </van-tab>
      <van-tab title="视频">
        <van-empty v-if="rideoList.length === 0" description="暂无数据" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
/**
 * 根据日期获取相册中的图片和视频列表，并展示出来。
 */
import { showImagePreview } from 'vant';
import 'vant/lib/image-preview/style';
import { useUserStore } from '@/stores/user'
export default {
  name: 'album-index',
  data() {
    return {
      user: this.$route.params.user,
      showPicker: false,
      pickerValue: [],
      fieldValue: '',
      columns: [],
      imgObj: {},
    }
  },
  computed: {
    imageList() {
      return this.imgObj[this.fieldValue] || [];
    },
    rideoList() {
      return [];
    },
  },
  mounted() {
    this.getImages()
  },
  methods: {
    getImages() {
      const pathPrefix = `/src/assets/users/${this.user}/images/`;
      const store = useUserStore()
      const { images } = store;
      const target = Object.entries(images).filter(([path, url]) => path.startsWith(pathPrefix))
      console.log('target', target);
      target.forEach(([path, url], index, oriArr) => {
        // const fileName = path.split('/').pop();
        const folderName = path.split('/').slice(-2, -1)[0];
        console.log('folderName', folderName);
        if (index === oriArr.length - 1) {
          this.pickerValue.push(folderName);
          this.fieldValue = folderName;
        }
        // const newUrl = url.replace('/public', '');
        if (this.imgObj.hasOwnProperty(folderName) && Array.isArray(this.imgObj[folderName])) {
          this.imgObj[folderName].push(url)
        } else {
          this.imgObj[folderName] = [];
          this.imgObj[folderName].push(url);
          this.columns.push({ text: folderName, value: folderName });
        }
      })
      console.log('this.imgObj', this.imgObj);
    },
    showImg(index) {
      showImagePreview({
        images: this.imageList,
        startPosition: index,
        closeable: true,
      });
    },
    onConfirm({ selectedValues, selectedOptions }) {
      this.showPicker = false;
      this.pickerValue = selectedValues;
      this.fieldValue = selectedOptions[0].text;
    },
  },
}
</script>

<style scoped>
.album {
  /* width: 100%; */
  height: 100vh;
  padding: 12px 16px 0 16px;

  .van-cell {
    align-items: baseline;
  }

  .vanTabs {
    margin: 12px 0;
  }

  :deep(.van-tabs__nav--card) {
    margin: 0;
  }

  :deep(.van-tabs__content) {
    padding-top: 8px;
  }

  .tabImg {
    width: 100%;
    height: auto;
    margin-top: 8px;
    object-fit: contain;
  }
}
</style>
