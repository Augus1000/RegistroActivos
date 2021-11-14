import { Registry } from './../models/registry';

export function convertSnaps<T>(snaps){
    return <T[]> snaps.map(snap => {
      return  {
        id: snap.payload.doc.id,
        ...snap.payload.doc.data() as Object
      };
})
}
