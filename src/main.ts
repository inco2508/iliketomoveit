export default class ILikeToMoveIt {
    elements: NodeListOf<Element>
    dragged: Element | null = null;

    constructor(elements: NodeListOf<Element>) {
        this.elements = elements

        for (const [index, element] of elements.entries()) {
            if (element instanceof HTMLElement) {
                element.addEventListener("dragstart", (event) => this.dragStart(event, index))
                element.addEventListener("dragover", (event) => this.dragOver(event))
                element.addEventListener("dragend", (event) => this.dragEnd(event))
                element.addEventListener("drop", (event) => this.drop(event))
            }
        }
    }

    private dragStart(
        event: DragEvent, 
        index: number, 
    ) {
        if (!event.dataTransfer) return
        if (!(event.target instanceof Element)) return
    
        event.dataTransfer.setData("application/iliketomoveit", String(index))
        event.dataTransfer.dropEffect = "move"
    
        this.dragged = event.target 
        this.dragged.classList.add("dragged")
    }
    
    private dragOver(event: DragEvent) {
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
    }
    
    private dragEnd(event: DragEvent) {
        event.preventDefault()
    
        if (this.dragged) {
            this.dragged.classList.remove("dragged")
        }
    }
    
    private drop(event: DragEvent) {
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
    }
    
    private isInFirstHalf(element: Element, mouse: { x: number, y: number }) {
        const { y, height } = element.getBoundingClientRect() 
        const relativeY = mouse.y - y 
    
        return relativeY <= (height / 2)
    }
}