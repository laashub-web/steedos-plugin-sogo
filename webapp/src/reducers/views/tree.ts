
import { TREE_STATE_CHANGE_ACTION } from '../../actions/views/tree'
import { getEntityState } from '../../states/entitys'
import _ from 'underscore'


/**
 * return: {id: {label: ,type: , id}}
 * @param records 待转换的数据
 */
function transformData(records: any){
	console.log("transformData records", records);
    let items: any = {}
    records.forEach((element: any) => {
        let item: any= {id: element._id, label: element.name}
        if( _.isEmpty(element.children)){
            item.type = 'item'
        }else{
            item.type = 'branch'
            item.nodes = element.children
        }
        items[element._id] = item
    });
    return items;
}


//TODO: 优化onExpandClick，onClick
function reducer(state:any = {}, action: any){
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        let objectName = action.objectName;
        let entityState = state[objectName];
		let value = action.partialStateValue
		let nodeId: string = value.node? value.node.id : ""
        switch (action.partialStateName) {
            case 'onExpandClick':
                entityState.nodes[value.node.id]["expanded"] = value.expand
                break;
            case 'onClick':
				let selectedNodeIds = entityState.selectedNode
				if(selectedNodeIds.length > 0){
					(entityState.nodes[selectedNodeIds[0]] as any).selected = false
				}
                let selected = value.select ? true : value.node.selected
				entityState.nodes[nodeId]["selected"] = selected
				if(selected){
					entityState.selectedNode = [nodeId]
                }
				break;
			case 'loadDataSauce':
                return Object.assign({}, state, {[objectName]: {...state[objectName], nodes: transformData(action.partialStateValue.records), totalCount: action.partialStateValue.totalCount}});
            default:
                break;
        }
        return Object.assign({}, state, {[objectName]: {...state[objectName], [action.partialStateName]: action.partialStateValue}});
        
    }
    return state;
};

export default reducer