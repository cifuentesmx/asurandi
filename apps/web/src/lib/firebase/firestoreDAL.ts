import {
    doc,
    getDoc,
    type Primitive,
    FieldValue,
    type UnionToIntersection,
} from "firebase/firestore"
import { error } from "@sveltejs/kit"
import { db } from "./app.client"

export const dbFirestoreDocument = async (
    documentPath: string
) => {
    const ref = doc(db, documentPath)
    const docSnap = await getDoc(ref)
    if (!docSnap.exists()) {
        throw error(404, 'No se encontró el registro')
    }
    const data = docSnap.data()
    data.id = docSnap.id
    return data

}

// to use with set()
export type PartialWithFieldValue<T> =
    | Partial<T>
    | (T extends Primitive
        ? T
        : T extends {}
        ? { [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue }
        : never);

export type WithFieldValue<T> =
    | T
    | (T extends Primitive
        ? T
        : T extends {}
        ? { [K in keyof T]: WithFieldValue<T[K]> | FieldValue }
        : never);

export type UpdateData<T> = T extends Primitive
    ? T
    : T extends {}
    ? { [K in keyof T]?: UpdateData<T[K]> | FieldValue } & NestedUpdateFields<T>
    : Partial<T>;

export type NestedUpdateFields<T extends Record<string, unknown>> =
    UnionToIntersection<
        {
            [K in keyof T & string]: ChildUpdateFields<K, T[K]>;
        }[keyof T & string]
    >;

export type ChildUpdateFields<K extends string, V> =
    V extends Record<string, unknown>
    ? AddPrefixToKeys<K, UpdateData<V>>
    : never;

export type AddPrefixToKeys<
    Prefix extends string,
    T extends Record<string, unknown>
> = { [K in keyof T & string as `${Prefix}.${K}`]+?: T[K] };

