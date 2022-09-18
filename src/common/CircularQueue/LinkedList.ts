class LinkedList<T>{
    constructor(
        public value: T,
        public next: LinkedList<T> | null = null
    ) { }
}

export default LinkedList;