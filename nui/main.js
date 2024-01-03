const eye = document.getElementById('eye')
const elements = document.getElementById('elements')

function createEle(tag,className,parent) {
    const ele = document.createElement(tag)

    if (className) {
    ele.className = className
    }

    if (parent) {
    parent.append(ele)
    }

    return ele
}

function setTargets(targets = []) {
    elements.innerHTML = '';

    if (targets.length === 0) {
        eye.classList.toggle('active', false);
        return;
    }

    eye.classList.toggle('active', true);

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];

        const item = createEle('DIV', 'item', elements);
        const icon = createEle('DIV', 'icon ' + target.icon, item);

        const items = createEle('DIV', 'items', item);

        for (let j = 0; j < target.items.length; j++) {
            const index = j;
            const itemData = target.items[index];

            const label = createEle('DIV', 'label', items);
            label.textContent = itemData.label;

            label.onclick = function () {
                const payload = {
                    id: target.id,
                    index: index
                };

                $.post(`https://${GetParentResourceName()}/select`, JSON.stringify(payload));
                document.body.style.opacity = 0;
            };
        }
    }
}


function closeFrame() {
    document.body.style.opacity = 0        
    $.post(`https://${GetParentResourceName()}/closed`)   
}

window.addEventListener('message',function(e) {
    switch (e.data.type) {
    case 'config':
        for (var key in e.data.colors) {
        document.documentElement.style.setProperty(key,e.data.colors[key])
        }
    break

    case 'open':
        setTargets(e.data.targets)
        document.body.style.opacity = 1
    break

    case 'setTargets':
        setTargets(e.data.targets)
    break

    case 'close':
        document.body.style.opacity = 0
    break
    }
})

window.addEventListener('keyup',function(e) {
    if (e.key == "Escape" || e.key == "Backspace") {
    closeFrame()
    }
})