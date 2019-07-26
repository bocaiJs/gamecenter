import ChangeAvatar from '@/base/changeavatar/changeavatar';
import { mapMutations, mapGetters } from 'vuex';

export const avatarMixin = {
    data() {
        return {
            showAvatar: false,
        };
    },
    created() {
        console.log(this.showAvatar);
    },
    methods: {
        showAvatarWrapper() {
            this.showAvatar = true;
        },
        hideAvatar(avatar) {
            if (avatar) {
                this.setavatar(avatar);
            }
            this.showAvatar = false;
        },
        ...mapMutations([
            'setavatar',
        ]),
    },
    computed: {
        ...mapGetters(['avatar', 'getToken']),
    },
    components: {
        ChangeAvatar,
    },
};
export const ERROR_OK = 0;
