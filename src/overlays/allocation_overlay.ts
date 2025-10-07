import {
    SDFGNode,
    SDFGElement,
    Edge,
    ControlFlowBlock,
} from '../renderer/sdfg/sdfg_elements';
import { SDFGRenderer } from '../renderer/sdfg/sdfg_renderer';
import { OverlayType } from '../types';
import { GenericSdfgOverlay } from './common/generic_sdfg_overlay';
import { KELLY_COLORS } from 'rendure/src/utils/colors';

export class AllocationOverlay extends GenericSdfgOverlay {

    public static readonly type: OverlayType = OverlayType.NODE;
    public readonly olClass: typeof GenericSdfgOverlay = AllocationOverlay;

    private AllocationMap: Record<string, string[]> = {};
    private FocusedNodes: string[] = [];

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
        if (typeof node === 'string' && !this.FocusedNodes.includes(node))
            this.FocusedNodes.push(node);
    }

    public hasKey(node: any) {
        return typeof node === 'string' &&
            Object.keys(this.AllocationMap).includes(node);
    }



    public shadeElem(elem: SDFGElement): void {
        for(const [index, dataContainer] of this.FocusedNodes.entries()) {
            if(Object.keys(this.AllocationMap).includes(dataContainer)) {
                if (this.AllocationMap[dataContainer].includes(elem.guid))
                    elem.shade('#' + KELLY_COLORS[index].toString(16));
            }
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
