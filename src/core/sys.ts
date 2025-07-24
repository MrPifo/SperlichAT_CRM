class System {

    public readonly OPERATINGSTATE_NEW:number = 0;
    public readonly OPERATINGSTATE_EDIT:number = 1;
	public readonly OPERATINGSTATE_FILTER:number = 2;
	
	public readonly VIEWMODE_NEW:number = 0;
	public readonly VIEWMODE_EDIT:number = 1;
	public readonly VIEWMODE_FILTER:number = 2;
	public readonly VIEWMODE_DETAIL:number = 3;
	public readonly VIEWMODE_MAIN:number = 4;
    
	operatingState: OperatingState = OperatingState.VIEW;
	viewMode: ViewMode = ViewMode.DETAIL;
	selectedRow: string | null = null;
	currentId: string | null = null;
	currentContext: string | null = null;
	isEditMode = (): boolean => this.viewMode == ViewMode.NEW || this.viewMode == ViewMode.EDIT;
}
export enum OperatingState {
	NEW = 0,
	EDIT = 1,
	VIEW = 2
}
export enum ViewMode {
	NEW = 0,
	EDIT = 1,
	FILTER = 2,
	DETAIL = 3,
	MAIN = 4,
	LOOKUP = 5
}
export enum State {
	AUTO = 0,
	EDIT = 1,
	READONLY = 2,
	DISABLED = 3,
	INVISIBLE = 4
}
export var sys = new System();