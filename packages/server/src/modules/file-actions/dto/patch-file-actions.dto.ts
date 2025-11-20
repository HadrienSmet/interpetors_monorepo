export class PatchFileActionDto {
    pageIndex: number;
    elements?: string;        // JSON.stringify(Array<ElementAction>)
    references?: string;      // JSON.stringify(Array<ReferenceElement>)
    generatedResources?: string; // JSON.stringify(Array<Note>)
}
