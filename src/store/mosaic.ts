import { AccountHttp, Address, AccountOwnedMosaicsService, MosaicHttp } from 'nem-library';

export default {
    namespaced: true,
    state: {
        mosaicLists: []
    },
    getters:  {
        mosaicList (state):Array<any> {
            return state.mosaicLists
        }
    },
    mutations: {
        setMosaics (state, mosaics) {
            state.mosaicLists = mosaics
        }
    },
    actions: {
        getMosaics({ commit }, address) {
            const accountOwnedMosaics = new AccountOwnedMosaicsService(new AccountHttp(), new MosaicHttp());
            accountOwnedMosaics.fromAddress(new Address(address)).subscribe(function (mosaics) {
                console.log(mosaics);
                commit('setMosaics', mosaics)
            });
        }
    }
}