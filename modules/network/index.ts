// @ts-nocheck
// TODO: support batch
export class Network {
  queue = []
  options: {
    pipes: []
  }

  constructor(props) {
    this.options = props
  }

  dispatch = (data: Record<string, unknown>) => {
    ;(this.options?.pipes || []).forEach((method) => {
      data = method(data)
    })

    console.log('[Network] Sending data:', data)
  }
}
