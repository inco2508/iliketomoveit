type Callback = (event: DragEvent, dragged: Element | null) => void

export default class ILikeToMoveIt {
    elements: NodeListOf<Element>
    dragged: Element | null = null;

    constructor(
        elements: NodeListOf<Element>,
        dragStartCallback?: Callback,
        dragOverCallback?: Callback,
        dragEndCallback?: Callback,
        dropCallback?: Callback,
    ) {
        this.elements = elements

        for (const [index, element] of elements.entries()) {
            if (element instanceof HTMLElement) {
                element.addEventListener("dragstart", (event) => this.dragStart(event, index, dragStartCallback))
                element.addEventListener("dragover", (event) => this.dragOver(event, dragOverCallback))
                element.addEventListener("dragend", (event) => this.dragEnd(event, dragEndCallback))
                element.addEventListener("drop", (event) => this.drop(event, dropCallback))
            }
        }
    }

    private dragStart(
        event: DragEvent, 
        index: number, 
        callback: (event: DragEvent, dragged: Element | null) => void
    ) {
        if (!event.dataTransfer) return
        if (!(event.target instanceof Element)) return
    
        event.dataTransfer.setData("application/iliketomoveit", String(index))
        event.dataTransfer.dropEffect = "move"
    
        this.dragged = event.target 
        
        if (callback) callback(event, this.dragged)
    }
    
    private dragOver(
        event: DragEvent,
        callback: (event: DragEvent, dragged: Element | null) => void
    ) {
        event.preventDefault()
    
        if (!event.dataTransfer) return
        if (!this.dragged) return
    
        event.dataTransfer.dropEffect = "move"
    
        const over = event.target
    
        if (!(over instanceof Element)) return
    
        if (over !== this.dragged) {
            if (this.isInFirstHalf(over, { x: event.clientX, y: event.clientY })) {
                this.dragged = over.insertAdjacentElement("beforebegin", this.dragged)
                
            } else {
                this.dragged = over.insertAdjacentElement("afterend", this.dragged)
            }   
        }

        if (callback) callback(event, this.dragged)
       
    }
    
    private dragEnd(
        event: DragEvent,
        callback: (event: DragEvent, dragged: Element | null) => void
    ) {
        event.preventDefault()
    
        if (callback) callback(event, this.dragged)
    }
    
    private drop(
        event: DragEvent,
        callback: (event: DragEvent, dragged: Element | null) => void
    ) {
        event.preventDefault()
    
        if (!event.dataTransfer) return
    
        const index = +event.dataTransfer.getData("application/iliketomoveit")
    
        const over = event.target
    
        if (!(over instanceof Element)) return
    
        if (this.isInFirstHalf(over, { x: event.clientX, y: event.clientY })) {
            over.insertAdjacentElement("beforebegin", this.elements[index])
            
        } else {
            over.insertAdjacentElement("afterend", this.elements[index])
        }    

        if (callback) callback(event, this.dragged)
    }
    
    private isInFirstHalf(element: Element, mouse: { x: number, y: number }) {
        const { y, height } = element.getBoundingClientRect() 
        const relativeY = mouse.y - y 
    
        return relativeY <= (height / 2)
    }
}