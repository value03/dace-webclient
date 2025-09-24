import {
    SDFGNode,
    SDFGElement,
    Edge,
    ControlFlowBlock,
} from '../renderer/sdfg/sdfg_elements';
import { SDFGRenderer } from '../renderer/sdfg/sdfg_renderer';
import { OverlayType } from '../types';
import { GenericSdfgOverlay } from './common/generic_sdfg_overlay';

export class AllocationOverlay extends GenericSdfgOverlay {

    public static readonly type: OverlayType = OverlayType.NODE;
    public readonly olClass: typeof GenericSdfgOverlay = AllocationOverlay;

    private AllocationMap: Record<string, string[]> = {};
    private FocusedNode: string | null = null;

    public constructor(renderer: SDFGRenderer) {
        super(renderer);

        this.refresh();
    }

    public refresh(): void {
        this.renderer.drawAsync();
    }

    public setAllocationMap(map: Record<string, string[]>) {
        this.AllocationMap = map;
    }

    public setFocusedNode(node: any) {
        if (typeof node === 'string')
            this.FocusedNode = node;
    }

    public hasKey(node: any) {
        return typeof node === 'string' &&
            Object.keys(this.AllocationMap).includes(node);
    }



    public shadeElem(elem: SDFGElement): void {
        if (
            this.FocusedNode !== null &&
            Object.keys(this.AllocationMap).includes(this.FocusedNode)
        ) {
            if (this.AllocationMap[this.FocusedNode].includes(elem.guid))
                elem.shade('#ff0000', 0.5);
        }
    }

    protected shadeBlock(block: ControlFlowBlock, ..._args: any[]): void {
        this.shadeElem(block);
    }

    protected shadeNode(node: SDFGNode, ..._args: any[]): void {
        this.shadeElem(node);
    }

    protected shadeEdge(edge: Edge, ..._args: any[]): void {
        this.shadeElem(edge);
    }

    public draw(): void {
        this.shadeSDFG();
    }
}
