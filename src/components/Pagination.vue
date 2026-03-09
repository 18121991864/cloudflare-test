<template>
  <div class="pagination-container display-flex flex-justify-content-flex-end flex-align-items-center">
    <p class="mr-20">共 {{ total }} 条<!--记录 第 {{ currentPage }} / {{ totalPage }} 页--></p>
    <a-pagination
v-model:current="currentPage" v-model:pageSize="pageSize" size="small"
                  :page-size-options="pageSizes" :total="total" v-bind="$attrs" show-size-changer
                  show-quick-jumper @change="change" />
  </div>
</template>

<script>

export default {
    name: 'Pagination',
    props: {
        total: {
            required: true,
            type: Number
        },
        page: {
            type: Number,
            default: 1
        },
        limit: {
            type: Number,
            default: 20
        },
        pageSizes: {
            type: Array,
            default() {
                return ['10', '20', '30', '50'];
            }
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        background: {
            type: Boolean,
            default: true
        },
        autoScroll: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        currentPage: {
            get() {
                return this.page;
            },
            set(val) {
                this.$emit('update:page', val);
            }
        },
        pageSize: {
            get() {
                return this.limit;
            },
            set(val) {
                this.$emit('update:limit', val);
            }
        },
        totalPage() {
            const { limit, total } = this;
            const totalPage = parseInt(`${total / limit}`);

            return total % limit === 0 ? totalPage : totalPage + 1;
        }
    },

    methods: {
        change(page, pageSize) {
            console.log('page', page);
            this.$emit('pagination', { page, limit: pageSize });
        }
    }
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 0;
  text-align: right;
}
</style>
