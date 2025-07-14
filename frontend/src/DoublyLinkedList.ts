class Node<T> {
  data: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Add element at the end
  append(data: T): void {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  // Add element at the beginning
  prepend(data: T): void {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  // Remove element from the end
  removeLast(): T | null {
    if (!this.tail) return null;

    const data = this.tail.data;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail!.next = null;
    }
    this.size--;
    return data;
  }

  // Remove element from the beginning
  removeFirst(): T | null {
    if (!this.head) return null;

    const data = this.head.data;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head!.prev = null;
    }
    this.size--;
    return data;
  }

  // Get element at specific index
  get(index: number): T | null {
    if (index < 0 || index >= this.size) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.data;
  }

  // Print list forward
  printForward(): void {
    let current = this.head;
    while (current) {
      console.log(current.data);
      current = current.next;
    }
  }

  // Print list backward
  printBackward(): void {
    let current = this.tail;
    while (current) {
      console.log(current.data);
      current = current.prev;
    }
  }

  // Get size of list
  getSize(): number {
    return this.size;
  }

  // Check if list is empty
  isEmpty(): boolean {
    return this.size === 0;
  }
}