
/**
 * Definition d'une classe représentant un cercle
 * @param {int} xc     x du centre
 * @param {int} yc     y du centre
 * @param {int} radius Rayon du cercle
 * @param {int} hid  parent; sibling; children; current
 */
function Circle(xc, yc, radius, hid) {
  this.xc = xc;
  this.yc = yc;
  this.radius = radius;
  this.hid = hid;

  /**
   * Est ce que le point passé en parametre est contenu dans le cercle ?
   * @param  {int} x     Abscisse du point à tester
   * @param  {int} y     Ordonnée du point à tester
   * @param  int} scale  Permet de mettre à l'echelle le rayon en retranchant ou ajoutant une somme
   * @return {boolean}       Vrai ou faux
   */
  this.contains = function(x, y, scale) {
    var rad = this.radius + scale;
    square_dist = Math.pow((this.xc - x), 2) + Math.pow((this.yc - y), 2);
    return (square_dist <= Math.pow(rad, 2));
  };

  /**
   * @return {string} The tooltip text
   */
  this.getTooltipText = function() {
    if(this.hid === "parent")
      return "One of " + NB_PARENTS + " parents";
    else if(this.hid === "sibling")
      return "One of " + NB_SIBLINGS + " siblings";
    else if(this.hid === "children")
      return "One of " + NB_CHILDREN + " children";
    else if(this.hid === "current")
      return "The current object";
  };

  /**
   * @return {String} L'url à suivre lors d'un clic sur le cercle
   */
  this.getTargetUrl = function() {
    if(this.hid === "parent")
      return "http://www.google.fr";
    else if(this.hid === "sibling")
      return "http://www.google.fr";
    else if(this.hid === "children")
      return "http://www.google.fr";
    else if(this.hid === "current")
      return "http://www.google.fr";
  };

  /**
   * Methode qui permet de dessiner le cercle
   */
  this.draw = function() {
    // création du titre :
    var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = this.getTooltipText();

    // animation rayon :
    var anim_radius = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    anim_radius.setAttributeNS(null, "attributeName", "r");
    anim_radius.setAttributeNS(null, "attributeType", "XML");
    anim_radius.setAttributeNS(null, "from", this.radius);
    anim_radius.setAttributeNS(null, "to", CURRENT_OBJECT.radius);
    anim_radius.setAttributeNS(null, "begin", "click");
    anim_radius.setAttributeNS(null, "dur", "1s");

    // animation x :
    var anim_x = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    anim_x.setAttributeNS(null, "attributeName", "cx");
    anim_x.setAttributeNS(null, "attributeType", "XML");
    anim_x.setAttributeNS(null, "from", this.xc);
    anim_x.setAttributeNS(null, "to", CURRENT_OBJECT.xc);
    anim_x.setAttributeNS(null, "begin", "click");
    anim_x.setAttributeNS(null, "dur", "1s");

    // animation y :
    var anim_y = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    anim_y.setAttributeNS(null, "attributeName", "cy");
    anim_y.setAttributeNS(null, "attributeType", "XML");
    anim_y.setAttributeNS(null, "from", this.yc);
    anim_y.setAttributeNS(null, "to", CURRENT_OBJECT.yc);
    anim_y.setAttributeNS(null, "begin", "click");
    anim_y.setAttributeNS(null, "dur", "1s");

    // création du cercle :
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttributeNS(null, "cx", this.xc);
    shape.setAttributeNS(null, "cy", this.yc);
    shape.setAttributeNS(null, "r", this.radius);
    shape.setAttributeNS(null, "class", this.hid); // classe CSS
    if(this.hid !== "current")
      shape.setAttributeNS(null, "onclick", "doClick()");

    // on ajoute le titre et les animations du cercle :
    shape.appendChild(title);
    shape.appendChild(anim_radius);
    shape.appendChild(anim_x);
    shape.appendChild(anim_y);

    // on ajoute le cercle dans le canvas :
    document.getElementById('hierarchy').appendChild(shape);
  };
}

