import { _decorator, Component, Node, input, Input, EventMouse, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Animation) cocosAnim: Animation | null = null;

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _currentJumpTime: number = 0;
    private _jumpTime: number = 1;
    private _currentJumpSpeed: number = 0;
    private _currentPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3(0, 0, 0);
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _currentMoveIndex: number = 0;

    start() {

    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        // input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_LEFT) {
            this.jumpByStep(1);
        } else if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            this.jumpByStep(2);
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) return;
        this._startJump = true;
        this._jumpStep = step;
        this._currentJumpSpeed = this._jumpStep / this._jumpTime;
        this._currentJumpTime = 0;
        this.node.getPosition(this._currentPos);
        Vec3.add(this._targetPos, this._currentPos, new Vec3(this._jumpStep, 0, 0));
        if (this.cocosAnim) {
            // this.cocosAnim.getState("cocos_anim_jump").speed = 3.5;
            this.cocosAnim.play("cocos_anim_jump");
        }
        this._currentMoveIndex += step;
    }

    Reset() {
        this._currentMoveIndex = 0;
    }

    // onMouseDown(event: EventMouse)
    // {

    // }

    onOnceJumpEnd() {
        if (this.cocosAnim) {
            this.cocosAnim.play('cocos_anim_idle');
        }

        this.node.emit('JumpEnd', this._currentMoveIndex);
    }


    update(deltaTime: number) {
        if (this._startJump) {
            this._currentJumpTime += deltaTime;
            if (this._currentJumpTime > this._jumpTime) {
                this.node.setPosition(this._targetPos);
                this.onOnceJumpEnd();
                this._startJump = false;
            }
            else {
                this.node.getPosition(this._currentPos);
                this._deltaPos.x = this._currentJumpSpeed * deltaTime;
                Vec3.add(this._currentPos, this._currentPos, this._deltaPos);
                this.node.setPosition(this._currentPos);
            }
        }
    }
}


