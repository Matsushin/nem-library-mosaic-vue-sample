import { AccountHttp, Address, AccountOwnedMosaicsService, MosaicHttp, MosaicId, Account, TimeWindow, TransferTransaction, TransactionHttp, EmptyMessage } from 'nem-library';
import { Observable } from 'rxjs/Rx';

export default {
    namespaced: true,
    state: {
        mosaicLists: [],
        message: '',
        error: '',
    },
    getters:  {
        mosaicList (state):Array<any> {
            return state.mosaicLists
        },
        message (state):string {
            return state.message
        },
        error (state):string {
            return state.error
        },
    },
    mutations: {
        setMosaics (state, mosaics) {
            for (const mosaic of mosaics) {
                const name = `${mosaic.mosaicId.namespaceId}:${mosaic.mosaicId.name}`
                state.mosaicLists.push({
                    name: name,
                    balance: mosaic.amount
                })
            }
        },
        setMessage (state, message) {
            state.message = message
        },
        setError (state, error) {
            state.error = error
        }
    },
    actions: {
        getMosaics({ commit }, address) {
            const accountOwnedMosaics = new AccountOwnedMosaicsService(new AccountHttp(), new MosaicHttp());
            accountOwnedMosaics.fromAddress(new Address(address)).subscribe(function (mosaics) {
                commit('setMosaics', mosaics)
            });
        },
        sendMosaic({ commit }, payload) {
            const account = Account.createWithPrivateKey(payload.privateKey)
            const mosaicNames = payload.mosaicName.split(':')
            Observable.from([
                { mosaic: new MosaicId(mosaicNames[0], mosaicNames[1]), quantity: payload.amount }
            ]).flatMap(_ => new MosaicHttp().getMosaicTransferableWithAmount(_.mosaic, _.quantity))
            .toArray()
            .map(mosaics => TransferTransaction.createWithMosaics(
                TimeWindow.createWithDeadline(),
                new Address(payload.toAddress),
                mosaics,
                EmptyMessage
                )
            )
            .map(transaction => account.signTransaction(transaction))
            .flatMap(signedTransaction => new TransactionHttp().announceTransaction(signedTransaction))
            .subscribe(
                value => {
                    commit('setMessage', value.message)
                    console.log( "リクエスト結果：\n" + value.message);
                },
                err => {
                    commit('setError', err.toString())
                    console.log( "失敗：\n" + err.toString());
                }
            )
        }
    }
}