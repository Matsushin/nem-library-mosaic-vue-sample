import { AccountHttp, Address, AccountOwnedMosaicsService, MosaicHttp, MosaicId, Account,
         TimeWindow, TransferTransaction, TransactionHttp, EmptyMessage } from 'nem-library';
import { Observable } from 'rxjs/Rx';

export default {
    namespaced: true,
    state: {
        mosaicLists: [],
        message: '',
        error: '',
    },
    getters:  {
        mosaicList(state: any): any[] {
            return state.mosaicLists;
        },
        message(state: any): string {
            return state.message;
        },
        error(state: any): string {
            return state.error;
        },
    },
    mutations: {
        setMosaics(state: any, mosaics: any) {
            for (const mosaic of mosaics) {
                const name = `${mosaic.mosaicId.namespaceId}:${mosaic.mosaicId.name}`;
                state.mosaicLists.push({
                    name: name,
                    balance: mosaic.amount,
                });
            }
        },
        setMessage(state: any, message: any) {
            state.message = message;
        },
        setError(state: any, error: any) {
            state.error = error;
        },
    },
    actions: {
        getMosaics({ commit }, address: string) {
            const accountOwnedMosaics = new AccountOwnedMosaicsService(new AccountHttp(), new MosaicHttp());
            accountOwnedMosaics.fromAddress(new Address(address)).subscribe((mosaics) => {
                commit('setMosaics', mosaics);
            });
        },
        sendMosaic({ commit }, payload: any) {
            const account = Account.createWithPrivateKey(payload.privateKey);
            const mosaicNames = payload.mosaicName.split(':');
            Observable.from([
                { mosaic: new MosaicId(mosaicNames[0], mosaicNames[1]), quantity: payload.amount },
            ]).flatMap((_) => new MosaicHttp().getMosaicTransferableWithAmount(_.mosaic, _.quantity))
            .toArray()
            .map((mosaics) => TransferTransaction.createWithMosaics(
                TimeWindow.createWithDeadline(),
                new Address(payload.toAddress),
                mosaics,
                EmptyMessage,
            ))
            .map((transaction) => account.signTransaction(transaction))
            .flatMap((signedTransaction) => new TransactionHttp().announceTransaction(signedTransaction))
            .subscribe(
                (value) => {
                    commit('setMessage', value.message);
                },
                (err) => {
                    commit('setError', err.toString());
                },
            );
        },
    },
};
