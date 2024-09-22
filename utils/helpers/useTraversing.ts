// Types
import type { ITreeNode } from '~/components/Tree/types/tree-node.type'
import type { IItem } from '~/libs/Shared/types/item.type'

export type INode<T extends {} = {}> = IItem<T> & {
  id: string | number
  name: string
  parent?: INode | null
  parents?: INode[]
  children?: INode[]
}

export function useTraversing() {
  /**
   * Goes through the tree via `parent` property, for each node, callback is
   * called to handle the node
   */
  const traverseParents = <T extends IItem>(
    nodes: IItem<T>[],
    callback: (parentNode: IItem<T> | null, currentNode: IItem<T>) => void,
    options: { parentField?: string, stop?: boolean } = {},
  ) => {
    // FIXME: Implement `stop`
    const { parentField = 'parent' } = options

    nodes.forEach(node => {
      if (node[parentField]) {
        const parent = node[parentField]

        callback(node[parentField], node)

        if (parent[parentField]) {
          traverseParents([parent], callback, options)
        }
      } else {
        callback(null, node)
      }
    })
  }

  /**
   * Goes through the tree via `children` property, for each node, callback is
   * called to handle the node
   */
  function traverseChildren<T extends IItem>(
    nodes: IItem<T>[] | undefined,
    callback: (
      parentNode: IItem<T> | null,
      currentNode: IItem<T>,
      idx: number
    ) => void,
    options: { childrenField?: string, childIdx?: number } = {},
    parentNode?: IItem<T>,
  ) {
    const { childrenField = 'children', childIdx } = options

    nodes?.forEach((node, idx) => {
      if (node[childrenField]) {
        callback(parentNode || null, node, childIdx ?? idx)

        node[childrenField].forEach((childNode: IItem<T>, childIdx: number) => {
          traverseChildren(
            [childNode],
            callback,
            { ...options, childIdx },
            node,
          )
        })
      } else {
        callback(parentNode || null, node, childIdx ?? idx)
      }
    })
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY
   * Requires `children` property on the nodes!
   * @param options.assignParent Assigns teh full `parent` object to each node
   * BE AWARE THAT THIS WILL MUTATE THE ORIGINAL ARRAY AND MIGHT BREAK A LOT OF THINGS
   * DUE TO CIRCULAR REFERENCES
   */
  const flattenTree = <T extends {} = {}>(
    nodes: INode<T>[],
    options?: { assignParent?: boolean },
  ) => {
    const { assignParent = false } = options || {}
    const flattenedNodes: INode<T>[] = []

    traverseChildren(nodes, (parentNode, currentNode) => {
      if (assignParent) {
        currentNode.parent = parentNode || null
      }

      flattenedNodes.push(currentNode)
    })

    return flattenedNodes
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY
   * Requires `parent` property on the nodes!
   */
  const flatToTree = (nodes: INode[], allNodes: INode[]) => {
    const nodesById: Record<INode['id'], INode> = {}

    // To keep track of nodes that have already been added to some parent node
    const usedNodeIdsByParentId: Record<
      INode['id'],
      Record<INode['id'], boolean>
    > = {}

    const nodeParentByNodeId = allNodes.reduce((agg, node) => {
      if (node.parent?.id) {
        agg[node.id] = node.parent
      }

      return agg
    }, {} as Record<INode['id'], INode>)

    traverseParents(nodes, (parentNode, currentNode) => {
      // This should trigger only when we filtered a node that has no children
      // Any other node should be handled in the `else if` lower
      if (!parentNode && !usedNodeIdsByParentId[currentNode.id]) {
        currentNode.children = []

        nodesById[currentNode.id] = currentNode
      }

      // For each parent of node, we reset the children and add it into the result
      else if (parentNode && nodesById[parentNode.id] === undefined) {
        parentNode.parent = nodeParentByNodeId[parentNode.id]
        parentNode.children = []

        nodesById[parentNode.id] = parentNode
      }

      // For any nested node (~ node with a parent)
      if (
        parentNode
        && usedNodeIdsByParentId[parentNode.id]?.[currentNode.id] === undefined
      ) {
        // We add the child nodes to the parent created above
        nodesById[parentNode.id].children?.push(currentNode)

        // Any node can only be added once to a parent,
        // so we keep track of the nodeIds we added to a parent
        if (usedNodeIdsByParentId[parentNode.id] === undefined) {
          usedNodeIdsByParentId[parentNode.id] = {}
        }

        usedNodeIdsByParentId[parentNode.id][currentNode.id] = true
      }
    })

    return Object.values(nodesById).filter(node => !node.parent)
  }

  /**
   * Gets children nodes of specified nodes ~ only the lowest level of children
   * for each node is returned
   */
  const getChildren = (nodes: INode[], allNodes: INode[]) => {
    const childrenById: Record<INode['id'], INode> = {}

    const nodesByParentId = allNodes.reduce((agg, node) => {
      if (node.parent?.id) {
        if (agg[node.parent.id] === undefined) {
          agg[node.parent.id] = []
        }

        agg[node.parent.id].push(node)
      }

      return agg
    }, {} as Record<INode['id'], INode[]>)

    const getChildNode = (nodes?: INode[]) => {
      nodes?.forEach(node => {
        const childrenNodes = nodesByParentId[node.id]

        if (childrenNodes) {
          getChildNode(childrenNodes)
        } else {
          childrenById[node.id] = node
        }
      })
    }

    getChildNode(nodes)

    return Object.values(childrenById)
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY ~ it adds `children`
   */
  const createTreeFromFlat = <T extends {} = {}>(nodes: ITreeNode<T>[]) => {
    const nodesById = nodes.reduce((agg, node) => {
      agg[node.id] = node
      node.children = []

      return agg
    }, {} as Record<ITreeNode['id'], ITreeNode<T>>)

    nodes.forEach(node => {
      if (node.parentId) {
        const parentNode = nodesById[node.parentId]

        if (parentNode.children === undefined) {
          parentNode.children = []
        }

        parentNode.children.push(node)
      }
    })

    return Object.values(nodesById).filter(node => !node.parentId)
  }

  return {
    createTreeFromFlat,
    flattenTree,
    flatToTree,
    getChildren,
    traverseChildren,
  }
}
